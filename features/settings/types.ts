export type SettingsData = {
  _id: string;
  name: string;
  slug: string;
  industry: string;
  phone: string;
  createdAt: Date;
  settings?: {
    email?: string;
    address?: string;
    description?: string;
    website?: string;
    [key: string]: any;
  };
  [key: string]: any;
};
