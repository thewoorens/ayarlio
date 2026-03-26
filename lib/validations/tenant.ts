import { z } from 'zod';

export const tenantSetupSchema = z.object({
  tenantName: z.string().min(2, 'Firma adı en az 2 karakter olmalıdır').max(100, 'Firma adı en fazla 100 karakter olabilir'),
  industry: z.string().min(2, 'Sektör alanı zorunludur'),
  phone: z.string().min(10, 'Geçerli bir firma telefonu giriniz'),
  coordinates: z.string().optional(),
  workingHours: z.record(z.string(), z.any()).optional(),
});


export type TenantSetupInput = z.infer<typeof tenantSetupSchema>;
