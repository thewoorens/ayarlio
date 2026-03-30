import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    tenantId: mongoose.Types.ObjectId;
    name: string;
    category: string;
    description?: string;
    duration: {
        value: number;
        unit: 'minutes' | 'hours' | 'days' | 'months' | 'years';
    };
    price: number;
    currency: string;
    isActive: boolean;
    staffIds: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: [true, 'Tenant is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Service name is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        duration: {
            value: {
                type: Number,
                required: [true, 'Duration value is required'],
                min: [1, 'Duration must be at least 1'],
            },
            unit: {
                type: String,
                enum: ['minutes', 'hours', 'days', 'months', 'years'],
                default: 'minutes',
            }
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        currency: {
            type: String,
            default: 'TRY',
            trim: true,
            uppercase: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        staffIds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

ServiceSchema.index({ tenantId: 1, isActive: 1 });

const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
