# Loams TypeScript examples

These examples target **Loams SDK 0.1.2**. Installation and CI require the matching
0.1.2 packages and release tags to be published.

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

`@loams/client` and `@loams/live` are pinned to `0.1.2`. Run `npm install` after publication to generate `package-lock.json`; commit the generated lockfile once the release resolves.

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

`@loams/client` provides namespaces, collections, documents, search, vector, graph, SQL and streams, alongside instance, Live and system modules. These examples retain the native JSON API helper in [`shared/rest.ts`](shared/rest.ts) to demonstrate those HTTP routes. For an app using SDK builders and collection handles directly, see the [SDK notes example](https://github.com/ostrium-labs/loams/blob/v0.1.2/sdks/typescript/examples/notes/main.ts).

More: [loams.dev/docs](https://loams.dev/docs) and [docs/release/preview.md](https://github.com/ostrium-labs/loams/blob/main/docs/release/preview.md).

## License

Apache-2.0.
