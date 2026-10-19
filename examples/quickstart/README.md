# quickstart

Connects with `@loams/client` (`loams.instance.getInstance`), creates a `kb` collection in the `examples-typescript` namespace (recreating it each run), upserts three documents with 3-dimensional embeddings, and runs one hybrid query: a vector retriever and a BM25 text retriever fused with reciprocal rank fusion, filtered to `tenant = "a"`.

```sh
npm run quickstart
```

Expected output: the server line, then two hits, `refund policy` first.
