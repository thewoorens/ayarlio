export interface ICustomer {
  _id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
  isActive: boolean;
}
