import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').max(50, 'İsim en fazla 50 karakter olabilir'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
    password: z
        .string()
        .min(8, "Şifre en az 8 karakter olmalıdır")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message: "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir",
        }),
    passwordConfirm: z.string().min(8, 'Şifre tekrarı en az 8 karakter olmalıdır'),
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor",
    path: ["passwordConfirm"],
});

export const loginSchema = z.object({
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    password: z.string().min(1, 'Şifre gereklidir'),
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Token gereklidir'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token gereklidir'),
    password: z
        .string()
        .min(8, 'Yeni şifre en az 8 karakter olmalıdır')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message: "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir",
        }),
    confirmPassword: z.string().min(8, 'Şifre tekrarı en az 8 karakter olmalıdır'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
