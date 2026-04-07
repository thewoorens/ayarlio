export const PLAN_CONFIG = {
    standard: {
        maxStaff: 1,
        maxBookingsPerMonth: 100,
        analytics: false,
        smsReminder: false,
        whatsapp: false,
        visitorPay: false,
    },
    pro: {
        maxStaff: 5,
        maxBookingsPerMonth: 10000,
        analytics: true,
        smsReminder: true,
        whatsapp: true,
        visitorPay: true,
    },
    enterprise: {
        maxStaff: 999,
        maxBookingsPerMonth: 99999,
        analytics: true,
        smsReminder: true,
        whatsapp: true,
        visitorPay: true,
    },
} as const;