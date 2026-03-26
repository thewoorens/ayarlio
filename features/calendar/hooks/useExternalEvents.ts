import { useEffect } from "react";

interface UseExternalEventsProps {
  selectedDay: number;
  dbServices: any[];
  dbStaff: any[];
  openAdd: () => void;
}

export function useExternalEvents({
  selectedDay,
  dbServices,
  dbStaff,
  openAdd
}: UseExternalEventsProps) {
  // Header'daki "Yeni Randevu" butonunu dinle
  useEffect(() => {
    const handler = () => openAdd();
    window.addEventListener("open-new-appointment", handler);
    return () => window.removeEventListener("open-new-appointment", handler);
  }, [selectedDay, dbServices, dbStaff, openAdd]);

  // URL param ?openNew=1
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("openNew") !== "1") return;

    openAdd();

    params.delete("openNew");
    const query = params.toString();
    window.history.replaceState({}, "", query ? `/pano/takvim?${query}` : "/pano/takvim");
  }, [selectedDay, dbServices, dbStaff, openAdd]);
}