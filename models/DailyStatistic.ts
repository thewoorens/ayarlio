import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyStatistic extends Document {
    tenantId: mongoose.Types.ObjectId;
    date: Date; // Keep as midnight of the specific localized date
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    newCustomers: number;
    totalRevenue: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}

const DailyStatisticSchema = new Schema<IDailyStatistic>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: [true, 'Tenant is required'],
            index: true,
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        totalAppointments: {
            type: Number,
            default: 0,
            min: 0,
        },
        completedAppointments: {
            type: Number,
            default: 0,
            min: 0,
        },
        cancelledAppointments: {
            type: Number,
            default: 0,
            min: 0,
        },
        newCustomers: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalRevenue: {
            type: Number,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
            default: 'TRY',
            trim: true,
            uppercase: true,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure there is only one statistic entry per tenant per date
DailyStatisticSchema.index({ tenantId: 1, date: 1 }, { unique: true });

const DailyStatistic = mongoose.models.DailyStatistic || mongoose.model<IDailyStatistic>('DailyStatistic', DailyStatisticSchema);

export default DailyStatistic;
