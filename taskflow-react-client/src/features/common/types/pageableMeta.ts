export interface PageableMeta {
  currentPage?: number | null;
  previousPage?: number | null;
  nextPage?: number | null;
  perPage?: number | null;
  totalPages?: number | null;
  totalCount?: number | null;
  isFirstPage?: boolean | null;
  isLastPage?: boolean | null;
}
