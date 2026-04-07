import mongoose, {Schema, Document} from 'mongoose';

export type PlanType = 'standard' | 'pro' | 'enterprise';

export interface ITenant extends Document {
    name: string;
    slug: string;
    industry: string;
    coordinates?: string;
    phone: string;
    isActive: boolean;
    plan: PlanType;
    trialEndsAt?: Date;
    limits: Schema.Types.Mixed;
    usage: Schema.Types.Mixed;
    workingHours: Record<string, any>;
    settings: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
    {
        name: {
            type: String,
            required: [true, 'Tenant name is required'],
            trim: true,
            maxlength: [100, 'Tenant name cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            required: [true, 'Tenant slug is required'],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        industry: {
            type: String,
            required: [true, 'Industry is required'],
            trim: true,
        },
        coordinates: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        plan: {
            type: String,
            enum: ['standard', 'pro', 'enterprise'],
            default: 'standard',
        },
        trialEndsAt: {
            type: Date,
        },
        limits: {
            type: Schema.Types.Mixed,
            default: {},
        },

        usage: {
            type: Schema.Types.Mixed,
            default: {},
        },
        workingHours: {
            type: Schema.Types.Mixed,
            default: {},
        },
        settings: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);
const Tenant = mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);

export default Tenant;
