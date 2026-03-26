import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
    tenantId: mongoose.Types.ObjectId;
    name: string;
    role: string;
    email: string;
    phone: string;
    color: string;
    status: 'active' | 'leave' | 'inactive';
    startTime: string;
    endTime: string;
    workDays: string[];
    services: string[];
    createdAt: Date;
    updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: [true, 'Tenant is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Staff name is required'],
            trim: true,
        },
        role: {
            type: String,
            trim: true,
            default: '',
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: '',
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        color: {
            type: String,
            default: '#3b82f6',
        },
        status: {
            type: String,
            enum: ['active', 'leave', 'inactive'],
            default: 'active',
        },
        startTime: {
            type: String,
            default: '09:00',
        },
        endTime: {
            type: String,
            default: '18:00',
        },
        workDays: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Performance index for fetching staff for a tenant
StaffSchema.index({ tenantId: 1 });

const Staff = mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);

export default Staff;
