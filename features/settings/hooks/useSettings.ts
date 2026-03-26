import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SettingsData } from "../types";

export function useSettings() {
  const { data, isLoading, error } = useSWR<{
    success: boolean;
    data: SettingsData;
  }>("/api/tenant/settings", fetcher);

  return {
    data: data?.data,
    isLoading,
    error,
  };
}
