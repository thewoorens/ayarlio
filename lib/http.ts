import { fetcher } from "./fetcher";

export const http = {
  get: <T>(url: string) => fetcher<T>(url),

  post: <T>(url: string, data: any) =>
    fetcher<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(url: string, data: any) =>
    fetcher<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T>(url: string) =>
    fetcher<T>(url, {
      method: "DELETE",
    }),
};
