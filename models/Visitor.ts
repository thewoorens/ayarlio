import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
    tenantId: mongoose.Types.ObjectId;
    userAgent?: string;
    referer?: string;
    notified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: [true, 'Tenant is required'],
            index: true,
        },
        userAgent: {
            type: String,
        },
        referer: {
            type: String,
        },
        notified: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const Visitor = mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);

export default Visitor;
