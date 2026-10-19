# sql

Loads the same `kb` collection, then runs three read-only statements over `POST /v1/namespaces/{ns}/sql`: a `count(*)`, a filtered `SELECT`, and hybrid retrieval in SQL with `rrf(vector_search(...), text_search(...))`. DDL and writes are refused by the server.

```sh
npm run sql
```
