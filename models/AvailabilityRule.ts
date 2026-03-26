import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailabilityRule extends Document {
    tenantId: mongoose.Types.ObjectId;
    staffId: mongoose.Types.ObjectId; // A user with 'admin' or 'staff' role
    type: 'weekly' | 'override';
    dayOfWeek?: number; // 0 (Sunday) to 6 (Saturday), used if type is 'weekly'
    specificDate?: Date; // Used if type is 'override' (e.g. holidays or special days off)
    isAvailable: boolean; // Indicates whether this time range is available or blocked
    startTime: string; // "HH:mm" format (e.g. "09:00")
    endTime: string; // "HH:mm" format (e.g. "17:00")
    createdAt: Date;
    updatedAt: Date;
}

const AvailabilityRuleSchema = new Schema<IAvailabilityRule>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: [true, 'Tenant is required'],
            index: true,
        },
        staffId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Staff ID is required'],
            index: true,
        },
        type: {
            type: String,
            enum: ['weekly', 'override'],
            required: [true, 'Rule type is required'],
        },
        dayOfWeek: {
            type: Number,
            min: 0,
            max: 6,
            required: function (this: IAvailabilityRule) { return this.type === 'weekly'; }
        },
        specificDate: {
            type: Date,
            required: function (this: IAvailabilityRule) { return this.type === 'override'; }
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        startTime: {
            type: String,
            required: [true, 'Start time is required'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format'],
        },
        endTime: {
            type: String,
            required: [true, 'End time is required'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format'],
        },
    },
    {
        timestamps: true,
    }
);

// Index to quickly fetch availability schedules by staff
AvailabilityRuleSchema.index({ tenantId: 1, staffId: 1, type: 1 });
AvailabilityRuleSchema.index({ tenantId: 1, staffId: 1, type: 1, dayOfWeek: 1 });
AvailabilityRuleSchema.index({ tenantId: 1, staffId: 1, type: 1, specificDate: 1 });

const AvailabilityRule = mongoose.models.AvailabilityRule || mongoose.model<IAvailabilityRule>('AvailabilityRule', AvailabilityRuleSchema);

export default AvailabilityRule;
