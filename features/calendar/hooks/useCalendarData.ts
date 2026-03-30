import { useState, useEffect } from "react";
import { Appointment, UpcomingAppointment, Service, Staff } from "../types";
import { COLORS } from "../constants";

export function useCalendarData(month: number, year: number) {
  const [map, setMap] = useState<Record<number, Appointment[]>>({});
  const [upcoming, setUpcoming] = useState<UpcomingAppointment[]>([]);
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [dbStaff, setDbStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const res = await fetch('/api/tenant/appointments');
      const json = await res.json();

      if (json.success) {
        const raw = json.data;
        const newMap: Record<number, Appointment[]> = {};
        const allAppts: (UpcomingAppointment & { isFuture: boolean; dateObj: Date })[] = [];

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        raw.forEach((appt: any) => {
          const st = new Date(appt.startTime);
          const apptYear = st.getFullYear();
          const apptMonth = st.getMonth();
          const apptDay = st.getDate();

          const timeStr = st.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

          const mappedAppt: Appointment = {
            id: appt._id,
            label: appt.customerId ? `${appt.customerId.name}` : 'İsimsiz',
            phone: appt.customerId?.phone || '',
            email: appt.customerId?.email || '',
            color: appt.serviceId?.color || COLORS[0],
            time: timeStr,
            service: appt.serviceId || { _id: "0", name: "Silinmiş Hizmet" },
            staff: appt.staffId || { _id: "0", name: "Silinmiş Personel" },
            tenantId: appt.tenantId,
            customerId: appt.customerId?._id,
            originalDate: st
          };

          if (apptYear === year && apptMonth === month) {
            if (!newMap[apptDay]) newMap[apptDay] = [];
            newMap[apptDay].push(mappedAppt);
          }

          if (st >= startOfToday) {
            allAppts.push({ ...mappedAppt, day: apptDay, month: apptMonth, isFuture: true, dateObj: st });
          }
        });

        setMap(newMap);
        allAppts.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        setUpcoming(allAppts.slice(0, 7));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadResources = async () => {
    try {
      const [resSvc, resStf] = await Promise.all([
        fetch('/api/tenant/services'),
        fetch('/api/tenant/staff')
      ]);

      const jsonSvc = await resSvc.json();
      const jsonStf = await resStf.json();

      if (jsonSvc.success) {
        setDbServices(jsonSvc.data);
      }
      if (jsonStf.success) {
        setDbStaff(jsonStf.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    loadResources();
  }, [month, year]);

  return {
    map,
    upcoming,
    dbServices,
    dbStaff,
    isLoading,
    reloadAppointments: loadAppointments
  };
}