export interface ICustomer {
  _id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  isActive: boolean;
}
