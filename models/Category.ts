import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    tenantId: mongoose.Types.ObjectId;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: [true, 'Tenant is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
        },
        color: {
            type: String,
            required: [true, 'Color is required'],
            default: '#3b82f6',
        },
    },
    {
        timestamps: true,
    }
);

// Performance index for fetching categories for a tenant
CategorySchema.index({ tenantId: 1, name: 1 }, { unique: true });

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
