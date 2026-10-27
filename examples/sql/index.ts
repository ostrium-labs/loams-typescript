// Read-only SQL over the quickstart collection, through loams.sql.
import { Loams } from '@loams/client';
import { API_KEY, ENDPOINT, NAMESPACE } from '../../shared/config.ts';

const loams = new Loams({ endpoint: ENDPOINT, auth: API_KEY, namespace: NAMESPACE });

async function sql(statement: string, params: (string | number | boolean | null)[] = []) {
  console.log(`\n> ${statement}`);
  for (const row of await loams.sql.records(statement, params)) console.log(row);
}

await sql('SELECT tenant, count(*) AS n FROM kb GROUP BY tenant ORDER BY tenant');
await sql('SELECT n, body FROM kb WHERE tenant = $1 ORDER BY n', ['a']);
await sql(
  "SELECT _id, body, _score FROM rrf(vector_search('kb', [1.0, 0.0, 0.0], 'embedding', 10), text_search('kb', 'refund', 'body', 10)) LIMIT 3",
);
