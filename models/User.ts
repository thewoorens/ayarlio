import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    tenantId?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: 'admin' | 'staff' | 'user';
    isActive: boolean;
    isSetup: boolean;
    emailVerify: boolean;
    verifyEmailToken?: string;
    verifyEmailExpire?: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    deleteAccountOTP?: string;
    deleteAccountOTPExpire?: Date;
    tokenVersion: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            index: true,
        },
        tokenVersion: {
            type: Number,
            default: 0,
        },
        deleteAccountOTP: {
            type: String,
        },
        deleteAccountOTPExpire: {
            type: Date,
        },
        name: {
            type: String,
            required: [true, 'User name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required'],
            select: false,
        },
        role: {
            type: String,
            enum: ['admin', 'staff', 'user'],
            default: 'staff',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isSetup: {
            type: Boolean,
            default: false,
        },
        emailVerify: {
            type: Boolean,
            default: false,
        },
        verifyEmailToken: {
            type: String,
        },
        verifyEmailExpire: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpire: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
