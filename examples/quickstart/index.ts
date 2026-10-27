// Create one namespace and collection, write documents, then use the SDK's
// hybrid-search, vector, SQL, stream and optional Graph modules.
import { AlreadyExistsError, Filter, Loams, Schema, rrf } from '@loams/client';
import { API_KEY, ENDPOINT, NAMESPACE } from '../../shared/config.ts';

const loams = new Loams({ endpoint: ENDPOINT, auth: API_KEY, namespace: NAMESPACE, sessionConsistency: true });
const info = await loams.instance.getInstance({});
console.log(`connected to ${info.name} ${info.serverVersion} (namespace ${NAMESPACE})`);

try {
  await loams.namespaces.create({ namespace: NAMESPACE });
} catch (error) {
  if (!(error instanceof AlreadyExistsError)) throw error;
}
try {
  await loams.collections.create({
    name: 'kb',
    schema: new Schema().text('body').keyword('tenant').i64('n').vector('embedding', 3).toJson(),
  });
} catch (error) {
  if (!(error instanceof AlreadyExistsError)) throw error;
}

const kb = loams.collection('kb');
await kb.upsert([
  { id: 1, source: { body: 'refund policy', tenant: 'a', n: 1 }, vectors: { embedding: [1, 0, 0] } },
  { id: 2, source: { body: 'shipping times', tenant: 'a', n: 2 }, vectors: { embedding: [0.9, 0.1, 0] } },
  { id: 3, source: { body: 'refund window', tenant: 'b', n: 3 }, vectors: { embedding: [0, 0, 1] } },
]);
console.log('wrote 3 documents to kb');

const hybrid = await kb.search(
  kb.query()
    .text('refund', { fields: ['body'] })
    .vector('embedding', [1, 0, 0], { k: 10 })
    .fuse(rrf(60))
    .filter(Filter.eq('tenant', 'a'))
    .limit(3),
);
for (const hit of hybrid.hits) console.log('hybrid', hit.pk, hit.score, hit.source);

const vector = await loams.vector.search({
  collection: 'kb',
  retrievers: [{ retriever: { case: 'vector', value: { field: 'embedding', query: [1, 0, 0], k: 3 } } }],
  filter: Filter.eq('tenant', 'a'),
  limit: 3,
});
console.log('vector hits:', vector.hits.length);

for (const row of await loams.sql.records(
  'SELECT tenant, count(*) AS n FROM kb WHERE n >= $1 GROUP BY tenant ORDER BY tenant',
  [1],
)) {
  console.log('sql', row.tenant, row.n);
}

await loams.streams.create({ name: 'kb-events', partitions: 1 });
await loams.streams.produce({
  stream: 'kb-events',
  records: [{ value: new TextEncoder().encode(JSON.stringify({ document: 1, action: 'indexed' })) }],
  producerId: 'typescript-example',
  producerSeq: 1n,
});
for await (const event of loams.streams.subscribe({ stream: 'kb-events' })) {
  console.log('stream event offset:', event.offset);
  break;
}

// Graph is experimental and feature-gated. Query a graph only when this engine
// advertises the capability and the namespace already contains a graph.
if (await loams.system.available('graph')) {
  const graphs = await loams.graph.list({ namespace: NAMESPACE, pageSize: 1 });
  if (graphs.graphs.length > 0) {
    const result = await loams.graph.query({
      namespace: NAMESPACE,
      graph: graphs.graphs[0].name,
      statement: 'RETURN 1 AS value',
      language: 1,
      readOnly: true,
    });
    console.log('graph rows:', result.rows?.rows.length ?? 0);
  } else {
    console.log('graph is enabled; create a graph before running the optional GQL query');
  }
} else {
  console.log('graph is experimental and not enabled in this engine build');
}
