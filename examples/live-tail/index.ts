// A live tail. It subscribes to one Live query with `loams.live.watch` and
// prints every result the server pushes, with the state version it arrived at.
//
//   node examples/live-tail/index.ts                       # watch the table catalog, exit after the first result
//   LOAMS_LIVE_TABLE=tickets node examples/live-tail/index.ts   # tail a table of your deployed schema
//   LOAMS_LIVE_TABLE=tickets LOAMS_LIVE_WRITE=1 ...             # also insert 3 rows, and watch them arrive
//
// It uses Live's built-in `_system:*` functions, so no function bundle is
// needed. Live tables come from a deployed schema (see the README), which is
// why the default watches the catalog, which always exists.
import { Loams, FeatureNotInVariantError, isLoamsError } from '@loams/client';
import { API_KEY, ENDPOINT } from '../../shared/config.ts';
import { fromValue, toValue } from '../../shared/value.ts';

const table = process.env.LOAMS_LIVE_TABLE;
const write = process.env.LOAMS_LIVE_WRITE === '1';
const follow = Boolean(table);

const loams = new Loams({ endpoint: ENDPOINT, auth: API_KEY });
try {
  await loams.system.guard('live'); // no RPC once cached; throws if this build lacks Live
} catch (error) {
  if (error instanceof FeatureNotInVariantError) {
    console.error(`this server variant (${error.variant}) does not carry loams.live.v1`);
    process.exit(1);
  }
  throw error;
}

const query = table
  ? { function: '_system:query', args: toValue({ table, order: 'asc' }) }
  : { function: '_system:tables', args: toValue({}) };

const abort = new AbortController();
const stopAfter = setTimeout(() => abort.abort(), follow ? 30_000 : 10_000);

const created: string[] = [];
const writer = write && table
  ? (async () => {
      for (const n of [1, 2, 3]) {
        await new Promise((r) => setTimeout(r, 500));
        const res = await loams.tables.mutate({
          function: '_system:insert',
          args: toValue({ table, fields: { title: `example ticket ${n}`, status: 'open' } }),
        });
        created.push(fromValue(res.result) as string);
        console.log(`inserted example ticket ${n}`);
      }
    })()
  : undefined;

try {
  const stream = loams.live.watch(
    { start: { case: 'initial', value: { version: 1n, queries: [{ queryId: 1, ...query }] } } },
    { signal: abort.signal },
  );
  let expected = 0;
  for await (const transition of stream) {
    for (const update of transition.updates) {
      const u = update.update;
      if (u.case === 'value') {
        const rows = fromValue(u.value) as { name?: string; title?: string }[];
        const label = rows.map((r) => r.name ?? r.title ?? '?').join(', ');
        console.log(`ts=${transition.end?.ts} rows=${rows.length}: ${label || '(empty)'}`);
      } else if (u.case === 'error') {
        throw new Error(`query ${update.queryId}: ${u.value.message}`);
      }
    }
    expected += 1;
    if (!follow || (write && created.length === 3 && expected > 3)) abort.abort();
  }
} catch (error) {
  if (!abort.signal.aborted) {
    console.error(isLoamsError(error) ? `${error.reason ?? error.code}: ${error.message}` : error);
    process.exitCode = 1;
  }
} finally {
  clearTimeout(stopAfter);
  await writer;
  for (const id of created) {
    await loams.tables.mutate({ function: '_system:delete', args: toValue({ id }) });
  }
  if (created.length) console.log(`cleaned up ${created.length} rows`);
}
