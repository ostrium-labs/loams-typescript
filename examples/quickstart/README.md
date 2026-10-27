# quickstart

Uses only the published `@loams/client` 0.1.2 modules. It creates the namespace and `kb` collection if absent, upserts three documents, runs hybrid and vector searches, reads SQL records, appends and subscribes to a stream event, and optionally queries the first existing Graph when that experimental feature is enabled. It does not drop or reset existing data.

```sh
npm run quickstart
```

Graph is detected through `loams.system.available('graph')`; if enabled, create a graph in the examples namespace to run the read-only GQL query.
