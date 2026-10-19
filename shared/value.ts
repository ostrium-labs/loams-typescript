// Conversions between plain JS values and `loams.live.v1.Value`.
import type { Value } from '@loams/live';

/** A JS value as a `Value` message init (what `args` takes). */
export function toValue(v: unknown): any {
  if (v === null || v === undefined) return { kind: { case: 'nullValue', value: {} } };
  if (typeof v === 'string') return { kind: { case: 'stringValue', value: v } };
  if (typeof v === 'boolean') return { kind: { case: 'boolValue', value: v } };
  if (typeof v === 'bigint') return { kind: { case: 'int64Value', value: v } };
  if (typeof v === 'number') {
    return Number.isInteger(v)
      ? { kind: { case: 'int64Value', value: BigInt(v) } }
      : { kind: { case: 'doubleValue', value: v } };
  }
  if (Array.isArray(v)) return { kind: { case: 'arrayValue', value: { values: v.map(toValue) } } };
  const fields = Object.fromEntries(Object.entries(v as object).map(([k, x]) => [k, toValue(x)]));
  return { kind: { case: 'objectValue', value: { fields } } };
}

/** A `Value` message as a plain JS value (int64 becomes number). */
export function fromValue(v: Value | undefined): unknown {
  const kind = v?.kind;
  if (!kind) return null;
  switch (kind?.case) {
    case undefined:
    case 'nullValue':
      return null;
    case 'int64Value':
      return Number(kind.value);
    case 'arrayValue':
      return kind.value.values.map(fromValue);
    case 'objectValue':
      return Object.fromEntries(Object.entries(kind.value.fields).map(([k, x]) => [k, fromValue(x)]));
    default:
      return kind.value;
  }
}
