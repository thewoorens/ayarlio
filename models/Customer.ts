import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    tenantId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    notes?: string;
    isActive: boolean;
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
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
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
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure uniqueness of customer email per tenant
CustomerSchema.index({ tenantId: 1, email: 1 }, { unique: true });

// Index for quick search by name or phone
CustomerSchema.index({ tenantId: 1, lastName: 1, firstName: 1 });
CustomerSchema.index({ tenantId: 1, phone: 1 });

const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
