# Sistema de Permissões do Menu

Este documento explica como o sistema de permissões foi implementado no menu lateral (sidebar) do ConnectHub.

## Visão Geral

O menu lateral agora filtra automaticamente os itens baseado nas permissões do usuário logado. Cada item do menu possui permissões específicas que determinam se o usuário pode visualizá-lo ou não.

## Estrutura das Permissões

### Interface NavItem

```typescript
// Importado de @/types/permissions
import { NavItem, SubItem, PERMISSIONS } from "@/types/permissions";

export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: React.ReactNode;
  subitems?: SubItem[];
  permission?: MenuPermission;
}

export interface SubItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: MenuPermission;
}
```

### Permissões por Item do Menu

#### 1. Dashboard
- **Permissão**: Nenhuma (acessível para todos os usuários autenticados)
- **Descrição**: Página inicial do sistema

#### 2. Gestão de Leads
- **Permissão Principal**: `PERMISSIONS.LEADS_READ`
- **Subitens**:
  - **Cadastro**: `PERMISSIONS.LEADS_CREATE` (AGENT, MANAGER, ADMIN)
  - **Visualizar**: `PERMISSIONS.LEADS_READ` (AGENT, MANAGER, ADMIN, VIEWER)
  - **Buscar Leads**: `PERMISSIONS.LEADS_READ` (AGENT, MANAGER, ADMIN, VIEWER)

#### 3. Imóveis
- **Permissão Principal**: `PERMISSIONS.PROPERTIES_READ`
- **Subitens**:
  - **Buscar Imóveis**: `PERMISSIONS.PROPERTIES_READ` (AGENT, MANAGER, ADMIN, VIEWER)
  - **Novo**: `PERMISSIONS.PROPERTIES_CREATE` (MANAGER, ADMIN)
  - **Visualizar**: `PERMISSIONS.PROPERTIES_READ` (AGENT, MANAGER, ADMIN, VIEWER)

#### 4. Propostas e Vendas
- **Permissão Principal**: `PERMISSIONS.DEALS_READ`
- **Subitens**:
  - **Registros**: `PERMISSIONS.DEALS_READ` (AGENT, MANAGER, ADMIN, VIEWER)
  - **Propostas**: `PERMISSIONS.DEALS_CREATE` (AGENT, MANAGER, ADMIN)
  - **Vendas**: `PERMISSIONS.DEALS_UPDATE` (AGENT, MANAGER, ADMIN)

#### 5. Relatórios
- **Permissão Principal**: `PERMISSIONS.REPORTS_READ`
- **Subitens**:
  - **Vendedores**: `PERMISSIONS.REPORTS_READ` (AGENT, MANAGER, ADMIN, VIEWER)
  - **Tempo médio**: `PERMISSIONS.REPORTS_READ` (AGENT, MANAGER, ADMIN, VIEWER)
  - **Estoque por status**: `PERMISSIONS.REPORTS_READ` (AGENT, MANAGER, ADMIN, VIEWER)

#### 6. Configurações
- **Permissão Principal**: `PERMISSIONS.SETTINGS_READ`
- **Subitens**:
  - **Usuários**: `PERMISSIONS.USERS_READ` (MANAGER, ADMIN)
  - **Planos**: `PERMISSIONS.SUBSCRIPTIONS_READ` (ADMIN)
  - **Integrações**: `PERMISSIONS.SETTINGS_UPDATE` (ADMIN)
  - **Permissões**: `PERMISSIONS.SETTINGS_UPDATE` (ADMIN)

## Implementação

### 1. Filtro de Permissões

O componente `AppSidebarLinks` implementa a função `filterItemsByPermissions` que:

```typescript
const filterItemsByPermissions = (items: NavItem[]): NavItem[] => {
  return items
    .filter(hasItemPermission)
    .map((item) => {
      // Se o item tem subitems, filtra os subitems também
      if (item.subitems) {
        const filteredSubitems = item.subitems.filter(hasSubitemPermission);
        
        // Se não há subitems visíveis, não mostra o item principal
        if (filteredSubitems.length === 0) {
          return null;
        }
        
        return {
          ...item,
          subitems: filteredSubitems,
        };
      }
      
      return item;
    })
    .filter((item): item is NavItem => item !== null);
};
```

### 2. Verificação de Permissões

```typescript
// Função para verificar se o usuário tem permissão para um item
const hasItemPermission = (item: NavItem): boolean => {
  // Se não há permissão definida, o item é acessível para todos
  if (!item.permission) return true;
  
  return hasPermission(item.permission.resource, item.permission.action);
};

// Função para verificar se o usuário tem permissão para um subitem
const hasSubitemPermission = (subitem: NonNullable<NavItem["subitems"]>[0]): boolean => {
  // Se não há permissão definida, o subitem é acessível para todos
  if (!subitem.permission) return true;
  
  return hasPermission(subitem.permission.resource, subitem.permission.action);
};
```

### 3. Uso do Hook usePermissions

```typescript
const { hasPermission } = usePermissions();
```

## Comportamento por Role

### ADMIN
- ✅ **Dashboard**: Sempre visível
- ✅ **Gestão de Leads**: Visível com todos os subitens
- ✅ **Imóveis**: Visível com todos os subitens
- ✅ **Propostas e Vendas**: Visível com todos os subitens
- ✅ **Relatórios**: Visível com todos os subitens
- ✅ **Configurações**: Visível com todos os subitens

### MANAGER
- ✅ **Dashboard**: Sempre visível
- ✅ **Gestão de Leads**: Visível com todos os subitens
- ✅ **Imóveis**: Visível com todos os subitens
- ✅ **Propostas e Vendas**: Visível com todos os subitens
- ✅ **Relatórios**: Visível com todos os subitens
- ✅ **Configurações**: Visível (exceto "Planos" e "Integrações")

### AGENT
- ✅ **Dashboard**: Sempre visível
- ✅ **Gestão de Leads**: Visível (exceto "Cadastro")
- ✅ **Imóveis**: Visível (exceto "Novo")
- ✅ **Propostas e Vendas**: Visível com todos os subitens
- ✅ **Relatórios**: Visível com todos os subitens
- ❌ **Configurações**: Não visível

### VIEWER
- ✅ **Dashboard**: Sempre visível
- ✅ **Gestão de Leads**: Visível (apenas "Visualizar" e "Buscar Leads")
- ✅ **Imóveis**: Visível (apenas "Buscar Imóveis" e "Visualizar")
- ✅ **Propostas e Vendas**: Visível (apenas "Registros")
- ✅ **Relatórios**: Visível com todos os subitens
- ❌ **Configurações**: Não visível

## Componente de Demonstração

Foi criado o componente `MenuPermissionsDemo` que mostra:

1. **Informações do usuário**: Nome, email e role
2. **Permissões do menu**: Lista detalhada de cada item e subitem
3. **Resumo das permissões**: Grid com todas as permissões do usuário

### Como usar o componente de demonstração:

```typescript
import { MenuPermissionsDemo } from "@/components/permissions/menu-permissions-demo";

function MyPage() {
  return (
    <div>
      <h1>Teste de Permissões do Menu</h1>
      <MenuPermissionsDemo />
    </div>
  );
}
```

## Exemplos de Uso

### 1. Adicionando um novo item ao menu

```typescript
import { NavItem, PERMISSIONS } from "@/types/permissions";

const newMenuItem: NavItem = {
  title: "Novo Módulo",
  url: "/new-module",
  icon: NewIcon,
  permission: PERMISSIONS.NEWMODULE_READ, // Definir em types/permissions.ts
  subitems: [
    {
      title: "Criar",
      url: "/new-module/create",
      icon: PlusIcon,
      permission: PERMISSIONS.NEWMODULE_CREATE,
    },
    {
      title: "Listar",
      url: "/new-module/list",
      icon: ListIcon,
      permission: PERMISSIONS.NEWMODULE_READ,
    },
  ],
};
```

### 2. Verificando permissões programaticamente

```typescript
import { PERMISSIONS } from "@/types/permissions";

function MyComponent() {
  const { hasPermission } = usePermissions();
  
  const canCreateUsers = hasPermission(PERMISSIONS.USERS_CREATE.resource, PERMISSIONS.USERS_CREATE.action);
  const canViewReports = hasPermission(PERMISSIONS.REPORTS_READ.resource, PERMISSIONS.REPORTS_READ.action);
  
  return (
    <div>
      {canCreateUsers && (
        <button>Criar Usuário</button>
      )}
      
      {canViewReports && (
        <ReportsSection />
      )}
    </div>
  );
}
```

## Manutenção

### Adicionando novas permissões

1. **Backend**: Atualize o `PermissionsService` com as novas permissões
2. **Tipos**: Adicione as novas permissões em `types/permissions.ts`
3. **Frontend**: Atualize `ROLE_PERMISSIONS` em `lib/permissions.ts`
4. **Menu**: Adicione as permissões aos itens do menu em `app-sidebar-nav-links.tsx`

### Modificando permissões existentes

1. **Backend**: Atualize o `PermissionsService`
2. **Tipos**: Atualize as constantes em `types/permissions.ts`
3. **Frontend**: Atualize `ROLE_PERMISSIONS` em `lib/permissions.ts`
4. **Menu**: Atualize as permissões nos itens do menu
5. **Teste**: Verifique se o menu está filtrando corretamente

## Troubleshooting

### Item do menu não aparece
- Verifique se o usuário tem a permissão necessária
- Confirme se a permissão está definida corretamente no item usando `PERMISSIONS`
- Verifique se o hook `usePermissions` está funcionando
- Confirme se a permissão está importada de `@/types/permissions`

### Subitem não aparece
- Verifique se o subitem tem permissão definida usando `PERMISSIONS`
- Confirme se o usuário tem a permissão específica do subitem
- Verifique se o item pai tem permissão (se não tiver, o subitem não aparece)
- Confirme se as constantes estão importadas corretamente

### Menu vazio
- Verifique se o usuário está autenticado
- Confirme se o hook `useAuth` está retornando o usuário
- Verifique se as permissões estão sendo carregadas corretamente
- Confirme se os tipos estão sendo importados de `@/types/permissions`

## Segurança

- ✅ **Frontend**: Filtragem de itens baseada em permissões
- ✅ **Backend**: Verificação de permissões nos endpoints
- ✅ **Sincronização**: Frontend e backend usam o mesmo sistema de permissões
- ✅ **Tipagem**: Tipos centralizados garantem consistência
- ✅ **Fallback**: Itens sem permissão definida são acessíveis para todos

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

O sistema garante que apenas usuários com as permissões adequadas vejam os itens do menu correspondentes, proporcionando uma experiência de usuário mais limpa e segura.
