# Loams TypeScript examples

[Loams](https://loams.dev) is an open-source data engine on object storage: collections with vector, full-text and hybrid search, SQL over the same data, and a reactive layer (Live). These examples use the TypeScript SDK, [`@loams/client`](https://www.npmjs.com/package/@loams/client) and [`@loams/live`](https://www.npmjs.com/package/@loams/live).

| Example | What it shows |
|---|---|
| [`examples/quickstart`](examples/quickstart) | connect, create a collection, upsert documents, hybrid search (vector + BM25 + filter) |
| [`examples/sql`](examples/sql) | SQL over a collection, including `rrf(vector_search(...), text_search(...))` |
| [`examples/live-tail`](examples/live-tail) | a Live subscription with `loams.live.watch`, and writes with `loams.tables.mutate` |

## Install

Needs Node 22.18 or newer (the examples run as TypeScript directly).

```sh
npm install
```

`@loams/client` and `@loams/live` are pinned to `0.1.0-preview.2`, the newest build on npm. The `0.1.0` packages have not been published to npm yet; when they are, bump the two versions in `package.json`. Until then the SDK source is in [`sdks/typescript`](https://github.com/ostrium-labs/loams/tree/main/sdks/typescript) of the main repo.

## Run against a local engine

Start an engine from the [main repo](https://github.com/ostrium-labs/loams) (`cargo run -p loams -- dev`, which listens on `127.0.0.1:8080`) or the compose stack described in [docs/release/preview.md](https://github.com/ostrium-labs/loams/blob/main/docs/release/preview.md). Then:

```sh
npm run quickstart
npm run sql
npm run live-tail
```

Settings, all optional:

| Variable | Default | Meaning |
|---|---|---|
| `LOAMS_ENDPOINT` | `http://127.0.0.1:8080` | engine base URL |
| `LOAMS_NAMESPACE` | `examples-typescript` | the only namespace the examples read or write |
| `LOAMS_API_KEY` | none | bearer key for a protected instance (auth is off in `loams dev`) |

`npm run build` type-checks every example.

## What the SDK covers today

`@loams/client` 0.1.0 has instance, auth, admin, Live (`loams.live`, `loams.tables`) and system modules. Collections, documents, search and SQL are not in its generated facade yet, so `quickstart` and `sql` call the same port's native JSON routes through a 40-line helper ([`shared/rest.ts`](shared/rest.ts)) and use the SDK client to connect. They will move to SDK modules when those exist.

More: [loams.dev/docs](https://loams.dev/docs) and [docs/release/preview.md](https://github.com/ostrium-labs/loams/blob/main/docs/release/preview.md).

## License

Apache-2.0.
