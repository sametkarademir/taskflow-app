import type { PageableMeta } from "./pageableMeta.ts";

export interface PagedResult<T> {
  data?: Array<T> | null;
  meta?: PageableMeta | null;
}
