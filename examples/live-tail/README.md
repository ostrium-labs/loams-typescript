# live-tail

A small app around Live. It subscribes with `loams.live.watch` to one query and prints every result the server pushes, with its state version. `await loams.system.guard('live')` first, so a build without Live fails with a clear message (`FeatureNotInVariantError`).

```sh
npm run live-tail                                          # watch the table catalog; exits after the first result
LOAMS_LIVE_TABLE=tickets npm run live-tail                 # tail a table in your deployed schema (30 s)
LOAMS_LIVE_TABLE=tickets LOAMS_LIVE_WRITE=1 npm run live-tail   # also insert three rows with loams.tables.mutate, watch them arrive, then delete them
```

Live tables come from a deployed schema, and `_system:insert` fails with `table ... is not in the deployed schema` for a table that is not in it, so the default mode watches the catalog (`_system:tables`), which always exists. The write mode needs a table you have deployed with fields `title` and `status` (any validator that accepts them). The write path follows the SDK's types and the built-in function contract but was not exercised against a deployed table when this example was written.

Live is unstable in 0.1.0: its wire contract may change.
