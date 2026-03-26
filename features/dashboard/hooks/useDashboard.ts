import useSWR from "swr";
import { DashboardData } from "../types";
import { fetcher } from "@/lib/fetcher";

export function useDashboard() {
  const { data, isLoading, error } = useSWR<{
    success: boolean;
    data: DashboardData;
  }>("/api/tenant/dashboard", fetcher);

  return {
    data: data?.data,
    isLoading,
    error,
  };
}
