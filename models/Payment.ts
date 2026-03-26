import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
    tenantId: mongoose.Types.ObjectId;
    appointmentId: mongoose.Types.ObjectId;
    customerId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    provider: string; // e.g., 'stripe', 'iyzico', 'cash', 'transfer'
    transactionId?: string;
    receiptUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: [true, 'Tenant is required'],
            index: true,
        },
        appointmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Appointment',
            required: [true, 'Appointment is required'],
            index: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'Customer is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        currency: {
            type: String,
            default: 'TRY',
            trim: true,
            uppercase: true,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
            index: true,
        },
        provider: {
            type: String,
            required: [true, 'Payment provider is required'],
            trim: true,
        },
        transactionId: {
            type: String,
            trim: true,
        },
        receiptUrl: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

PaymentSchema.index({ tenantId: 1, appointmentId: 1 }, { unique: true });
PaymentSchema.index({ transactionId: 1 }, { sparse: true }); // Provider txn ID search

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
