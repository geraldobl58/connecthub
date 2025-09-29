# Sistema de Permissões por Role

Este documento explica como funciona o sistema de permissões baseado em roles implementado no ConnectHub.

## Visão Geral

O sistema de permissões utiliza um modelo baseado em roles (RBAC - Role-Based Access Control) que define diferentes níveis de acesso para usuários do sistema. Cada usuário possui uma role que determina quais ações ele pode realizar em diferentes recursos.

## Roles Disponíveis

### 1. ADMIN
- **Nível**: 4 (mais alto)
- **Descrição**: Acesso total ao sistema
- **Permissões**:
  - ✅ Criar, visualizar, editar e excluir usuários
  - ✅ Gerenciar tenants (empresas)
  - ✅ Gerenciar propriedades
  - ✅ Gerenciar leads
  - ✅ Gerenciar deals
  - ✅ Gerenciar tarefas
  - ✅ Visualizar relatórios
  - ✅ Gerenciar configurações
  - ✅ Gerenciar assinaturas

### 2. MANAGER
- **Nível**: 3
- **Descrição**: Gerenciamento operacional
- **Permissões**:
  - ✅ Visualizar e editar usuários
  - ✅ Gerenciar propriedades
  - ✅ Gerenciar leads
  - ✅ Gerenciar deals
  - ✅ Gerenciar tarefas
  - ✅ Visualizar relatórios
  - ✅ Visualizar configurações

### 3. AGENT
- **Nível**: 2
- **Descrição**: Operações básicas
- **Permissões**:
  - ✅ Visualizar propriedades
  - ✅ Criar, visualizar e editar leads
  - ✅ Criar, visualizar e editar deals
  - ✅ Criar, visualizar e editar tarefas
  - ✅ Visualizar relatórios

### 4. VIEWER
- **Nível**: 1 (mais baixo)
- **Descrição**: Apenas visualização
- **Permissões**:
  - ✅ Visualizar propriedades
  - ✅ Visualizar leads
  - ✅ Visualizar deals
  - ✅ Visualizar tarefas
  - ✅ Visualizar relatórios

## Implementação no Backend (API)

### Módulo de Permissões

O sistema de permissões está implementado no módulo `permissions`:

```
apps/api/src/permissions/
├── permissions.module.ts
├── permissions.service.ts
└── permissions.controller.ts
```

### Guards e Decorators

#### 1. PermissionsGuard
Verifica se o usuário tem as permissões necessárias para acessar um endpoint.

```typescript
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions({ resource: 'users', action: 'create' })
```

#### 2. Decorators de Permissão

```typescript
// Decorator genérico
@Permissions({ resource: 'users', action: 'create' })

// Decorators específicos
@RequireUserCreation()    // Apenas ADMIN
@RequireUserManagement()  // ADMIN e MANAGER
@RequireUserRead()        // ADMIN, MANAGER e AGENT
```

### Exemplo de Uso no Controller

```typescript
@Post('register')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequireUserCreation()
@ApiBearerAuth()
async register(@Body() dto: RegisterDto) {
  return this.service.register(dto);
}
```

### Proteção da Criação de Usuários

A criação de novos usuários está protegida e apenas usuários com role **ADMIN** podem criar novos usuários:

```typescript
// Endpoint protegido
POST /auth/register
Headers: Authorization: Bearer <token>
Body: { name, email, password, role, tenantId }

// Resposta para usuário não-ADMIN
{
  "statusCode": 403,
  "message": "Insufficient permissions. Missing: users:create",
  "error": "Forbidden"
}
```

## Implementação no Frontend

### Sistema de Permissões

O frontend possui um sistema de permissões sincronizado com o backend:

```
apps/web/src/lib/permissions.ts
apps/web/src/hooks/use-permissions.ts
apps/web/src/components/permissions/permission-guard.tsx
```

### Hook usePermissions

```typescript
import { usePermissions } from '@/hooks/use-permissions';

function MyComponent() {
  const { canCreateUsers, canManageUsers, hasRole } = usePermissions();

  return (
    <div>
      {canCreateUsers() && (
        <button>Criar Usuário</button>
      )}
      
      {canManageUsers() && (
        <button>Gerenciar Usuários</button>
      )}
    </div>
  );
}
```

### Componentes de Proteção

#### 1. PermissionGuard
Protege componentes baseado em permissões específicas:

```typescript
import { PermissionGuard } from '@/components/permissions/permission-guard';

<PermissionGuard resource="users" action="create">
  <CreateUserButton />
</PermissionGuard>
```

#### 2. RoleGuard
Protege componentes baseado em roles:

```typescript
import { RoleGuard, AdminOnly } from '@/components/permissions/permission-guard';

<RoleGuard requiredRole={Role.ADMIN}>
  <AdminPanel />
</RoleGuard>

// Ou usando componentes específicos
<AdminOnly>
  <AdminPanel />
</AdminOnly>
```

#### 3. Componentes Específicos

```typescript
import { 
  CanCreateUsers,
  CanManageUsers,
  CanViewUsers,
  ManagerOrAbove,
  AgentOrAbove
} from '@/components/permissions/permission-guard';

<CanCreateUsers>
  <CreateUserForm />
</CanCreateUsers>

<ManagerOrAbove>
  <ManagementPanel />
</ManagerOrAbove>
```

## Recursos e Ações

### Recursos Disponíveis

- **users**: Gerenciamento de usuários
- **tenants**: Gerenciamento de empresas
- **properties**: Gerenciamento de propriedades
- **leads**: Gerenciamento de leads
- **deals**: Gerenciamento de negócios
- **tasks**: Gerenciamento de tarefas
- **reports**: Visualização de relatórios
- **settings**: Configurações do sistema
- **subscriptions**: Gerenciamento de assinaturas

### Ações Disponíveis

- **create**: Criar novos registros
- **read**: Visualizar registros
- **update**: Editar registros existentes
- **delete**: Excluir registros

## Hierarquia de Roles

O sistema utiliza uma hierarquia numérica onde roles superiores herdam permissões das roles inferiores:

```
ADMIN (4) > MANAGER (3) > AGENT (2) > VIEWER (1)
```

## Exemplos de Uso

### 1. Proteger Endpoint no Backend

```typescript
@Controller('users')
export class UsersController {
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireUserCreation()
  async createUser(@Body() dto: CreateUserDto) {
    // Apenas ADMIN pode criar usuários
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireUserRead()
  async getUsers() {
    // ADMIN, MANAGER e AGENT podem visualizar
  }
}
```

### 2. Proteger Componente no Frontend

```typescript
function UsersPage() {
  return (
    <div>
      <h1>Usuários</h1>
      
      <CanCreateUsers>
        <Button>Criar Novo Usuário</Button>
      </CanCreateUsers>
      
      <CanViewUsers>
        <UsersList />
      </CanViewUsers>
    </div>
  );
}
```

### 3. Verificação Programática

```typescript
function MyComponent() {
  const { hasPermission, canCreateUsers } = usePermissions();

  const handleCreateUser = () => {
    if (!canCreateUsers()) {
      alert('Você não tem permissão para criar usuários');
      return;
    }
    
    // Lógica de criação
  };

  return (
    <button 
      onClick={handleCreateUser}
      disabled={!canCreateUsers()}
    >
      Criar Usuário
    </button>
  );
}
```

## Endpoints da API de Permissões

### GET /permissions/roles
Retorna todas as roles e suas permissões.

**Acesso**: ADMIN e MANAGER

```json
{
  "role": "ADMIN",
  "permissions": [
    {
      "resource": "users",
      "actions": ["create", "read", "update", "delete"]
    }
  ]
}
```

### GET /permissions/check/:role/:resource/:action
Verifica se uma role tem permissão para uma ação específica.

**Acesso**: ADMIN e MANAGER

```json
{
  "hasPermission": true,
  "role": "ADMIN",
  "resource": "users",
  "action": "create"
}
```

## Segurança

### Backend
- ✅ Verificação de permissões em todos os endpoints protegidos
- ✅ Validação de JWT token
- ✅ Verificação de role do usuário
- ✅ Mensagens de erro específicas para permissões insuficientes

### Frontend
- ✅ Componentes de proteção para UI
- ✅ Hooks para verificação programática
- ✅ Sincronização com sistema do backend
- ✅ Fallbacks para usuários sem permissão

## Manutenção

### Adicionando Novas Permissões

1. **Backend**: Atualize `PermissionsService` em `apps/api/src/permissions/permissions.service.ts`
2. **Frontend**: Atualize `ROLE_PERMISSIONS` em `apps/web/src/lib/permissions.ts`
3. **Testes**: Verifique se as permissões estão funcionando corretamente

### Adicionando Novas Roles

1. **Database**: Adicione a nova role no enum `Role` do Prisma
2. **Backend**: Atualize o `PermissionsService`
3. **Frontend**: Atualize `ROLE_PERMISSIONS` e `ROLE_HIERARCHY`
4. **Migration**: Execute a migration do banco de dados

## Troubleshooting

### Erro 403 - Forbidden
- Verifique se o usuário tem a role correta
- Confirme se a permissão está configurada corretamente
- Verifique se o token JWT é válido

### Componente não renderiza
- Verifique se o usuário está autenticado
- Confirme se a role do usuário tem as permissões necessárias
- Verifique se o componente de proteção está sendo usado corretamente

### Permissões não sincronizadas
- Certifique-se de que `ROLE_PERMISSIONS` no frontend está igual ao backend
- Verifique se as roles estão sendo passadas corretamente
- Confirme se o hook `usePermissions` está sendo usado corretamente
