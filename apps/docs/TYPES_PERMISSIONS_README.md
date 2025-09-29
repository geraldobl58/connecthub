# Sistema de Tipos de Permissões

Este documento explica a organização dos tipos e interfaces do sistema de permissões no arquivo `types/permissions.ts`.

## Estrutura do Arquivo

O arquivo `types/permissions.ts` centraliza todos os tipos, interfaces e constantes relacionados ao sistema de permissões, proporcionando:

- **Tipagem forte**: TypeScript com autocomplete e verificação de tipos
- **Organização**: Todos os tipos em um local centralizado
- **Reutilização**: Tipos compartilhados entre diferentes componentes
- **Manutenibilidade**: Fácil atualização e modificação

## Tipos e Interfaces

### 1. Enums

#### Role
```typescript
export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  AGENT = "AGENT",
  VIEWER = "VIEWER",
}
```

#### Resource
```typescript
export enum Resource {
  USERS = "users",
  TENANTS = "tenants",
  PROPERTIES = "properties",
  LEADS = "leads",
  DEALS = "deals",
  TASKS = "tasks",
  REPORTS = "reports",
  SETTINGS = "settings",
  SUBSCRIPTIONS = "subscriptions",
}
```

#### Action
```typescript
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}
```

### 2. Interfaces

#### Permission
```typescript
export interface Permission {
  resource: string;
  actions: string[];
}
```

#### RolePermissions
```typescript
export interface RolePermissions {
  role: Role;
  permissions: Permission[];
}
```

#### RequiredPermission
```typescript
export interface RequiredPermission {
  resource: string;
  action: string;
}
```

#### MenuPermission
```typescript
export interface MenuPermission {
  resource: string;
  action: string;
}
```

#### NavItem
```typescript
export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: React.ReactNode;
  subitems?: SubItem[];
  permission?: MenuPermission;
}
```

#### SubItem
```typescript
export interface SubItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: MenuPermission;
}
```

### 3. Constantes

#### ROLE_HIERARCHY
```typescript
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.ADMIN]: 4,
  [Role.MANAGER]: 3,
  [Role.AGENT]: 2,
  [Role.VIEWER]: 1,
};
```

#### PERMISSIONS
```typescript
export const PERMISSIONS = {
  // Usuários
  USERS_CREATE: { resource: Resource.USERS, action: Action.CREATE },
  USERS_READ: { resource: Resource.USERS, action: Action.READ },
  USERS_UPDATE: { resource: Resource.USERS, action: Action.UPDATE },
  USERS_DELETE: { resource: Resource.USERS, action: Action.DELETE },
  
  // Propriedades
  PROPERTIES_CREATE: { resource: Resource.PROPERTIES, action: Action.CREATE },
  PROPERTIES_READ: { resource: Resource.PROPERTIES, action: Action.READ },
  PROPERTIES_UPDATE: { resource: Resource.PROPERTIES, action: Action.UPDATE },
  PROPERTIES_DELETE: { resource: Resource.PROPERTIES, action: Action.DELETE },
  
  // ... outras permissões
} as const;
```

## Vantagens da Organização

### 1. Tipagem Forte
- **Autocomplete**: IDE sugere opções válidas
- **Verificação de tipos**: Erros detectados em tempo de compilação
- **Refatoração segura**: Mudanças propagadas automaticamente

### 2. Reutilização
- **Importação centralizada**: Um único local para importar tipos
- **Consistência**: Mesmos tipos usados em toda a aplicação
- **DRY**: Don't Repeat Yourself - evita duplicação

### 3. Manutenibilidade
- **Atualizações fáceis**: Mudança em um local afeta toda a aplicação
- **Documentação**: Tipos servem como documentação viva
- **Versionamento**: Controle de mudanças centralizado

## Exemplos de Uso

### 1. Importação de Tipos
```typescript
import { 
  Role, 
  Resource, 
  Action, 
  NavItem, 
  SubItem,
  MenuPermission,
  PERMISSIONS,
  ROLE_HIERARCHY
} from "@/types/permissions";
```

### 2. Uso em Componentes
```typescript
import { Role, Resource, Action, PERMISSIONS } from "@/types/permissions";

function MyComponent() {
  const [userRole, setUserRole] = useState<Role>(Role.VIEWER);
  
  const hasPermission = (resource: Resource, action: Action): boolean => {
    // Lógica de verificação
    return true;
  };
  
  return (
    <div>
      {hasPermission(PERMISSIONS.USERS_CREATE.resource, PERMISSIONS.USERS_CREATE.action) && (
        <button>Criar Usuário</button>
      )}
    </div>
  );
}
```

### 3. Uso em Menu
```typescript
import { NavItem, PERMISSIONS } from "@/types/permissions";

const menuItem: NavItem = {
  title: "Usuários",
  url: "/users",
  icon: UsersIcon,
  permission: PERMISSIONS.USERS_READ,
  subitems: [
    {
      title: "Criar",
      url: "/users/create",
      icon: PlusIcon,
      permission: PERMISSIONS.USERS_CREATE,
    },
  ],
};
```

### 4. Uso em Guards
```typescript
import { RequiredPermission, PERMISSIONS } from "@/types/permissions";

function PermissionGuard({ 
  children, 
  permission 
}: { 
  children: ReactNode; 
  permission: RequiredPermission; 
}) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission.resource, permission.action)) {
    return null;
  }
  
  return <>{children}</>;
}

// Uso do guard
<PermissionGuard permission={PERMISSIONS.USERS_CREATE}>
  <CreateUserButton />
</PermissionGuard>
```

## Migração dos Arquivos

### Antes (disperso)
```typescript
// Em app-sidebar-nav-links.tsx
export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: {
    resource: string;
    action: string;
  };
}

// Em permissions.ts
export enum Role {
  ADMIN = "ADMIN",
  // ...
}
```

### Depois (centralizado)
```typescript
// Em types/permissions.ts
export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: MenuPermission;
}

export enum Role {
  ADMIN = "ADMIN",
  // ...
}

// Em outros arquivos
import { NavItem, Role, PERMISSIONS } from "@/types/permissions";
```

## Benefícios da Migração

### 1. Organização
- ✅ **Centralização**: Todos os tipos em um local
- ✅ **Estrutura**: Hierarquia clara de tipos
- ✅ **Navegação**: Fácil localização de tipos

### 2. Desenvolvimento
- ✅ **Produtividade**: Autocomplete e sugestões
- ✅ **Qualidade**: Verificação de tipos em tempo real
- ✅ **Debugging**: Erros mais claros e específicos

### 3. Manutenção
- ✅ **Atualizações**: Mudanças em um local
- ✅ **Consistência**: Tipos uniformes em toda a aplicação
- ✅ **Documentação**: Tipos como documentação viva

## Próximos Passos

### 1. Expansão de Tipos
- Adicionar mais recursos conforme necessário
- Criar tipos específicos para diferentes contextos
- Implementar tipos para validação de formulários

### 2. Integração com Backend
- Sincronizar tipos com o backend
- Implementar validação de tipos em runtime
- Criar utilitários para conversão de tipos

### 3. Documentação
- Adicionar JSDoc aos tipos
- Criar exemplos de uso
- Documentar convenções de nomenclatura

## Convenções de Nomenclatura

### 1. Enums
- **Maiúsculas**: `Role.ADMIN`, `Resource.USERS`
- **Singular**: `Role`, `Resource`, `Action`
- **Descriptivo**: Nomes claros e específicos

### 2. Interfaces
- **PascalCase**: `NavItem`, `MenuPermission`
- **Sufixos**: `Permission`, `Item`, `Config`
- **Prefixos**: `Required`, `Optional`, `Base`

### 3. Constantes
- **SCREAMING_SNAKE_CASE**: `ROLE_HIERARCHY`, `PERMISSIONS`
- **Descriptivo**: Nomes que explicam o propósito
- **Agrupado**: Organização lógica por funcionalidade

## Troubleshooting

### 1. Erros de Importação
```typescript
// ❌ Erro: Módulo não encontrado
import { Role } from "@/lib/permissions";

// ✅ Correto: Importar do arquivo de tipos
import { Role } from "@/types/permissions";
```

### 2. Tipos Não Encontrados
```typescript
// ❌ Erro: Tipo não existe
interface MyType {
  role: string; // Tipo genérico
}

// ✅ Correto: Usar tipos específicos
interface MyType {
  role: Role; // Tipo específico
}
```

### 3. Permissões Não Funcionando
```typescript
// ❌ Erro: String hardcoded
const permission = { resource: "users", action: "read" };

// ✅ Correto: Usar constantes
const permission = PERMISSIONS.USERS_READ;
```

## Estrutura de Arquivos

```
apps/web/src/
├── types/
│   └── permissions.ts          # Tipos e constantes centralizados
├── lib/
│   └── permissions.ts          # Lógica de permissões
├── components/
│   ├── app-sidebar-nav-links.tsx  # Definição dos itens do menu
│   ├── app-sidebar-links.tsx      # Renderização do menu
│   └── permissions/
│       ├── permission-guard.tsx   # Componentes de proteção
│       └── menu-permissions-demo.tsx # Demonstração
└── hooks/
    └── use-permissions.ts      # Hook para verificação de permissões
```

## Benefícios da Organização

### 1. Desenvolvimento
- ✅ **Autocomplete**: IDE sugere opções válidas
- ✅ **Verificação de tipos**: Erros detectados em tempo de compilação
- ✅ **Refatoração segura**: Mudanças propagadas automaticamente
- ✅ **IntelliSense**: Melhor experiência de desenvolvimento

### 2. Manutenção
- ✅ **Centralização**: Todos os tipos em um local
- ✅ **Consistência**: Tipos uniformes em toda a aplicação
- ✅ **Documentação**: Tipos como documentação viva
- ✅ **Versionamento**: Controle de mudanças centralizado

### 3. Qualidade
- ✅ **Tipagem forte**: Prevenção de erros em tempo de compilação
- ✅ **Reutilização**: DRY - Don't Repeat Yourself
- ✅ **Escalabilidade**: Fácil adição de novos tipos
- ✅ **Testabilidade**: Tipos facilitam testes

Esta organização de tipos proporciona uma base sólida e escalável para o sistema de permissões, facilitando o desenvolvimento e a manutenção da aplicação.
