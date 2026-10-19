// SQL over a collection: an aggregate, a filter, and hybrid retrieval with
// rrf(vector_search(...), text_search(...)).
import { loadKb, rest } from '../../shared/rest.ts';

await loadKb('kb');

async function sql(query: string) {
  console.log(`\n> ${query}`);
  const result = await rest('POST', '/sql', { query });
  console.log(result.columns.map((c: { name: string }) => c.name).join('\t'));
  for (const row of result.rows) console.log(row.join('\t'));
}

await sql('SELECT count(*) AS n FROM kb');
await sql("SELECT _id, body, tenant FROM kb WHERE tenant = 'a' ORDER BY _id");
await sql(
  "SELECT _id, body, _score FROM rrf(vector_search('kb', [1.0, 0.0, 0.0], 'embedding', 10), text_search('kb', 'refund', 'body', 10)) LIMIT 3",
);
