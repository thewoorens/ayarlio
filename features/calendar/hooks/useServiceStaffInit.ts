import { useEffect } from "react";

interface UseServiceStaffInitProps {
  dbServices: any[];
  dbStaff: any[];
  serviceId: string;
  staffId: string;
  setServiceId: (id: string) => void;
  setStaffId: (id: string) => void;
}

export function useServiceStaffInit({
  dbServices,
  dbStaff,
  serviceId,
  staffId,
  setServiceId,
  setStaffId
}: UseServiceStaffInitProps) {
  useEffect(() => {
    if (dbServices.length > 0 && !serviceId) {
      setServiceId(dbServices[0]._id);
    }
  }, [dbServices, serviceId, setServiceId]);

  useEffect(() => {
    if (dbStaff.length > 0 && !staffId) {
      setStaffId(dbStaff[0]._id);
    }
  }, [dbStaff, staffId, setStaffId]);
}