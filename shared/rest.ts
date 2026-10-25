// A tiny helper over the engine's native JSON API.
//
// These examples demonstrate native JSON routes alongside the SDK. The SDK
// also offers app modules, builders, collection handles, SQL and streams.
import { API_KEY, ENDPOINT, NAMESPACE } from './config.ts';

export class RestError extends Error {
  readonly status: number;
  constructor(status: number, body: string) {
    super(`HTTP ${status}: ${body}`);
    this.status = status;
  }
}

export async function rest<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${ENDPOINT}/v1/namespaces/${NAMESPACE}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(API_KEY ? { authorization: `Bearer ${API_KEY}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new RestError(res.status, text);
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Create (or recreate) a collection so every run starts from the same state. */
export async function recreateCollection(name: string, schema: unknown): Promise<void> {
  try {
    await rest('DELETE', `/collections/${name}`);
  } catch (error) {
    if (!(error instanceof RestError) || error.status !== 404) throw error;
  }
  await rest('POST', '/collections', { name, schema, partitions: 1 });
}

export const KB_SCHEMA = {
  fields: [
    { name: 'body', source_path: 'body', kind: { text: { analyzer: 'standard', positions: true } }, indexed: true, fast: false },
    { name: 'tenant', source_path: 'tenant', kind: 'keyword', indexed: true, fast: true },
  ],
  vectors: [{ name: 'embedding', dim: 3, distance: 'cosine' }],
  sparse_vectors: [],
  dynamic: 'ignore',
  max_fields: 1000,
};

export const KB_DOCS = [
  { id: 1, body: 'refund policy', tenant: 'a', embedding: [1.0, 0.0, 0.0] },
  { id: 2, body: 'shipping times', tenant: 'a', embedding: [0.9, 0.1, 0.0] },
  { id: 3, body: 'refund window', tenant: 'b', embedding: [0.0, 0.0, 1.0] },
];

export async function loadKb(name: string): Promise<void> {
  await recreateCollection(name, KB_SCHEMA);
  await rest('POST', `/collections/${name}/documents`, {
    ops: KB_DOCS.map(({ id, embedding, ...source }) => ({ upsert: { id, source, vectors: { embedding } } })),
  });
}
