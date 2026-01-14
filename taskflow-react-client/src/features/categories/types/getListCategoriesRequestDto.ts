export interface GetListCategoriesRequestDto {
  page: number;
  perPage: number;
  search?: string | null;
  field?: string | null;
  order?: "asc" | "desc" | null;
}
