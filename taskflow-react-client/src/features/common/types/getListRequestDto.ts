export interface GetListRequestDto {
  page?: number | null;
  perPage?: number | null;
  search?: string | null;
  order?:  "asc" | "desc" | null;
  field?: string;
}
