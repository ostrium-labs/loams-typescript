# Loams TypeScript examples

These examples target the released **Loams SDK 0.1.2**.

[Loams](https://loams.dev) is an open-source data engine on object storage: collections with vector, full-text and hybrid search, SQL over the same data, and a reactive layer (Live). These examples use the TypeScript SDK, [`@loams/client`](https://www.npmjs.com/package/@loams/client) and [`@loams/live`](https://www.npmjs.com/package/@loams/live).

| Example | What it shows |
|---|---|
| [`examples/quickstart`](examples/quickstart) | namespace and collection setup, documents, hybrid/vector search, SQL, streams, optional Graph |
| [`examples/sql`](examples/sql) | SQL over a collection, including `rrf(vector_search(...), text_search(...))` |
| [`examples/live-tail`](examples/live-tail) | a Live subscription with `loams.live.watch`, and writes with `loams.tables.mutate` |
| [`examples/platform`](examples/platform) | opt-in, read-only auth, admin, audit and Live admin module calls |

## Install

Needs Node 22.18 or newer (the examples run as TypeScript directly).

```sh
npm install
```

`@loams/client` and `@loams/live` are pinned to `0.1.2`; `package-lock.json` locks the complete dependency tree.

## Run against a local engine

Start an engine from the [main repo](https://github.com/ostrium-labs/loams) (`cargo run -p loams -- dev`, which listens on `127.0.0.1:8080`) or the compose stack described in [docs/release/preview.md](https://github.com/ostrium-labs/loams/blob/main/docs/release/preview.md). Then:

```sh
npm run quickstart
npm run sql
npm run live-tail
LOAMS_PLATFORM_EXAMPLE=1 npm run platform   # requires an authorized API key or token
```

Settings, all optional:

| Variable | Default | Meaning |
|---|---|---|
| `LOAMS_ENDPOINT` | `http://127.0.0.1:8080` | engine base URL |
| `LOAMS_NAMESPACE` | `examples-typescript` | the only namespace the examples read or write |
| `LOAMS_API_KEY` | none | bearer key for a protected instance (auth is off in `loams dev`) |

`npm run build` type-checks every example.

## What the SDK covers today

`@loams/client` examples use the released high-level modules: namespace and collection setup, document handles, hybrid and vector search, SQL records, streams, instance discovery and system feature detection. Graph queries run only when Graph is advertised and a graph already exists. The opt-in platform example reads auth providers, projects, audit events and Live apps; it requires a credential with the relevant read permissions. House has no SDK module in 0.1.2. The separate Live-tail example remains opt-in and demonstrates `loams.live.watch` and `loams.tables.mutate`.

More: [loams.dev/docs](https://loams.dev/docs) and [docs/release/preview.md](https://github.com/ostrium-labs/loams/blob/main/docs/release/preview.md).

## License

Apache-2.0.
