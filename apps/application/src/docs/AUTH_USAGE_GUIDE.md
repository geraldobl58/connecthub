# Sistema de Autenticação - Guia de Uso

## Visão Geral

Este sistema fornece uma base genérica e reutilizável para autenticação com React Hook Form, Zod e React Query. Foi projetado para evitar repetição de código e facilitar a manutenção.

## Estrutura da Base Genérica

### 📁 Schemas de Validação (`src/schemas/auth.ts`)

Schemas Zod para validação de formulários:

```typescript
import { loginSchema, registerSchema, updateProfileSchema } from "../schemas/auth";
```

**Schemas disponíveis:**
- `loginSchema` - Validação para login (tenantId, email, password)
- `registerSchema` - Validação para registro (inclui confirmPassword)
- `forgotPasswordSchema` - Validação para recuperação de senha
- `resetPasswordSchema` - Validação para redefinição de senha
- `updateProfileSchema` - Validação para atualização de perfil

### 🔗 Serviços da API (`src/http/auth.ts`)

Serviço centralizado para chamadas da API:

```typescript
import { authService } from "../http/auth";
```

**Métodos disponíveis:**
- `login(credentials)` - Fazer login
- `register(data)` - Criar conta
- `logout()` - Fazer logout
- `getProfile()` - Buscar perfil do usuário
- `updateProfile(data)` - Atualizar perfil
- `forgotPassword(email)` - Solicitar recuperação de senha
- `resetPassword(data)` - Redefinir senha

### 🎣 Hooks React Query (`src/hooks/useAuth.ts`)

Hooks para gerenciamento de estado:

```typescript
import { 
  useLogin, 
  useRegister, 
  useAuth, 
  useProfile,
  useUpdateProfile 
} from "../hooks/useAuth";
```

### 🏷️ Types TypeScript (`src/types/auth.ts`)

Interfaces bem definidas:

```typescript
import type { 
  AuthRequest, 
  RegisterRequest, 
  RegisterFormData,
  User 
} from "../types/auth";
```

## Como Usar

### 1. Formulário de Login

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth";
import { useLogin } from "../hooks/useAuth";
import type { AuthRequest } from "../types/auth";

export function LoginForm() {
  const loginMutation = useLogin();
  
  const { control, handleSubmit, formState: { errors } } = useForm<AuthRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: { tenantId: "", email: "", password: "" },
  });

  const onSubmit = async (data: AuthRequest) => {
    try {
      await loginMutation.mutateAsync(data);
      // Sucesso - redirecionar
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="tenantId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Tenant ID"
            error={!!errors.tenantId}
            helperText={errors.tenantId?.message}
          />
        )}
      />
      {/* Outros campos... */}
    </form>
  );
}
```

### 2. Verificação de Autenticação

```tsx
import { useAuth } from "../hooks/useAuth";

export function ProtectedComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Carregando...</div>;
  if (!isAuthenticated) return <div>Não autorizado</div>;

  return <div>Olá, {user?.name}!</div>;
}
```

### 3. Criação de Novos Formulários

Para criar um novo formulário, siga este padrão:

1. **Defina o schema no `auth.ts`:**
```typescript
export const myNewSchema = z.object({
  field1: z.string().min(1, "Campo obrigatório"),
  field2: z.string().email("Email inválido"),
});
```

2. **Crie o tipo correspondente:**
```typescript
export interface MyNewRequest {
  field1: string;
  field2: string;
}
```

3. **Adicione o método no service:**
```typescript
myNewMethod: async (data: MyNewRequest) => {
  const response = await api.post('/my-endpoint', data);
  return response.data;
}
```

4. **Crie o hook React Query:**
```typescript
export function useMyNewMutation() {
  return useMutation({
    mutationFn: authService.myNewMethod,
    // configurações específicas
  });
}
```

5. **Use no componente:**
```tsx
export function MyNewForm() {
  const mutation = useMyNewMutation();
  const { control, handleSubmit } = useForm<MyNewRequest>({
    resolver: zodResolver(myNewSchema),
  });
  
  // resto da implementação...
}
```

## Benefícios desta Abordagem

✅ **Reutilização**: Schemas, tipos e hooks podem ser reutilizados<br>
✅ **Consistência**: Padrão uniforme em todos os formulários<br>
✅ **Type Safety**: TypeScript garante tipagem correta<br>
✅ **Validação**: Zod fornece validação robusta<br>
✅ **Estado**: React Query gerencia estado de loading/error<br>
✅ **Manutenção**: Mudanças centralizadas propagam automaticamente<br>

## Exemplos Implementados

- ✅ `LoginForm` - Login com tenant, email e senha
- ✅ `RegisterForm` - Registro com confirmação de senha
- ✅ `ProfileForm` - Atualização de perfil do usuário
- ✅ `ForgotPasswordForm` - Recuperação de senha por email

Todos seguem o mesmo padrão e podem ser usados como referência para novos formulários.