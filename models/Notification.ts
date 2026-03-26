import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    tenantId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId; // If sent to a staff/admin
    customerId?: mongoose.Types.ObjectId; // If sent to a customer
    type: 'email' | 'sms' | 'in-app';
    status: 'pending' | 'sent' | 'failed';
    subject?: string;
    content: string;
    metadata?: Record<string, any>; // For keeping provider message ids or extra data
    readAt?: Date; // For in-app notifications
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
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
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            index: true,
        },
        type: {
            type: String,
            enum: ['email', 'sms', 'in-app'],
            required: [true, 'Notification type is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'sent', 'failed'],
            default: 'pending',
            index: true,
        },
        subject: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Notification content is required'],
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
        readAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index to quickly fetch unread in-app notifications for users
NotificationSchema.index({ tenantId: 1, userId: 1, type: 1, readAt: 1 });
NotificationSchema.index({ tenantId: 1, customerId: 1, type: 1 });

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
