import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    tenantId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId; // User who performed the action (optional if system action)
    action: string; // e.g., 'create', 'update', 'delete', 'login'
    entity: string; // e.g., 'Appointment', 'User', 'Settings'
    entityId?: mongoose.Types.ObjectId;
    details?: Record<string, any>; // Can store old vs new values or generic details
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: [true, 'Tenant is required'],
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        action: {
            type: String,
            required: [true, 'Action is required'],
            trim: true,
        },
        entity: {
            type: String,
            required: [true, 'Entity is required'],
            trim: true,
            index: true,
        },
        entityId: {
            type: Schema.Types.ObjectId,
            index: true,
        },
        details: {
            type: Schema.Types.Mixed,
        },
        ipAddress: {
            type: String,
            trim: true,
        },
        userAgent: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false }, // Audit logs usually don't get updated
    }
);

// Common query indexes
AuditLogSchema.index({ tenantId: 1, createdAt: -1 });
AuditLogSchema.index({ tenantId: 1, entity: 1, entityId: 1 });

const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
