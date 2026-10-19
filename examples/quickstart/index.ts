// Quickstart: connect, create a collection, upsert documents, run a hybrid
// search (vector + BM25 + filter) and print the hits.
import { Loams } from '@loams/client';
import { API_KEY, ENDPOINT, NAMESPACE } from '../../shared/config.ts';
import { loadKb, rest } from '../../shared/rest.ts';

const loams = new Loams({ endpoint: ENDPOINT, auth: API_KEY });
const info = await loams.instance.getInstance({});
console.log(`connected to ${info.name} ${info.serverVersion} (namespace ${NAMESPACE})`);

await loadKb('kb');
console.log('wrote 3 documents to kb');

const result = await rest('POST', '/query', {
  from: 'collections.kb',
  retrieve: [
    { vector: { field: 'embedding', query: [1.0, 0.0, 0.0], k: 10 } },
    { text: { field: 'body', query: 'refund', k: 10 } },
  ],
  filter: { term: { tenant: 'a' } },
  fuse: { method: 'rrf', k: 60 },
  limit: 3,
});

for (const hit of result.hits) {
  console.log(`pk=${hit.pk} score=${Number(hit.score).toFixed(4)}`, JSON.stringify(hit.source ?? hit.fields ?? {}));
}
