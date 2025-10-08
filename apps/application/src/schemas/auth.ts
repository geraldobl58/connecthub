import { z } from 'zod';

// Schema base para validações comuns
const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Formato de email inválido')
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(1, 'Senha é obrigatória')
  .min(6, 'Senha deve ter pelo menos 6 caracteres');

const tenantIdSchema = z
  .string()
  .min(1, 'Tenant ID é obrigatório')
  .trim();

// Schema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  tenantId: tenantIdSchema,
});

// Schema para registro
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  tenantId: tenantIdSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

// Schema para recuperação de senha
export const forgotPasswordSchema = z.object({
  email: emailSchema,
  tenantId: tenantIdSchema,
});

// Schema para redefinição de senha
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

// Schema para atualização de perfil
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  email: emailSchema,
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  // Se newPassword for fornecida, currentPassword também deve ser
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  // Se newPassword for fornecida, confirmNewPassword também deve ser e devem coincidir
  if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
    return false;
  }
  // Se newPassword for fornecida, deve ter pelo menos 6 caracteres
  if (data.newPassword && data.newPassword.length < 6) {
    return false;
  }
  return true;
}, {
  message: 'Validação de senha inválida',
  path: ['newPassword'],
});

// Tipos derivados dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
