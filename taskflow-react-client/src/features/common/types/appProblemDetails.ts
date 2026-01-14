export interface AppProblemDetails {
  message?: string | null;
  statusCode?: number | null;
  errorCode?: string | null;
  correlationId?: string | null;
  details?: object | null;
}
