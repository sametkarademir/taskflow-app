export interface GetListTodoCommentsRequestDto {
  page: number;
  perPage: number;
  search?: string | null;
  field?: string | null;
  order?: "asc" | "desc" | null;
}
