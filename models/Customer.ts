import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    tenantId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: [true, 'Tenant is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        },
        phone: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
);

CustomerSchema.index({ tenantId: 1, email: 1 }, { unique: true });

CustomerSchema.index({ tenantId: 1, name: 1 });
CustomerSchema.index({ tenantId: 1, phone: 1 });

const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
