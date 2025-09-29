# Alinhamento do Menu com o Schema do Prisma

Este documento explica como o menu foi ajustado para ser fiel ao schema do Prisma, refletindo as entidades reais do banco de dados.

## Schema do Prisma - Entidades Principais

### 1. **User** (Usuários)
- Gerenciamento de usuários do sistema
- Roles: ADMIN, MANAGER, AGENT, VIEWER

### 2. **Tenant** (Empresa)
- Configurações da empresa/tenant
- Informações básicas e configurações

### 3. **Property** (Imóveis)
- Cadastro e gerenciamento de imóveis
- Relacionado com Owner (Proprietários)
- Endereço, mídias, características

### 4. **Lead** (Leads)
- Gestão de leads e prospects
- Relacionado com Stage (Pipeline)
- Tags, notas, tarefas

### 5. **Deal** (Negócios)
- Negócios fechados
- Relacionado com Lead e Property
- Status e valores

### 6. **Task** (Tarefas)
- Tarefas do sistema
- Relacionado com Lead, Property, User
- Prioridades e status

### 7. **Stage** (Pipeline)
- Estágios configuráveis do pipeline
- Para leads e suporte

### 8. **WhatsAppMessage** (Mensagens WhatsApp)
- Integração com WhatsApp Business
- Relacionado com Lead

### 9. **Note** (Notas)
- Notas do sistema
- Relacionado com Lead, Property, User

### 10. **Tag** (Tags)
- Sistema de tags
- Relacionado com Lead

### 11. **ActivityLog** (Log de Atividades)
- Auditoria do sistema
- Log de todas as ações

### 12. **Plan/Subscription** (Planos/Assinaturas)
- Sistema de planos
- Controle de uso

## Menu Ajustado

### Estrutura do Menu

```typescript
export const mainItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    // Acessível para todos
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Headset,
    permission: PERMISSIONS.LEADS_READ,
    subitems: [
      { title: "Listar Leads", url: "/leads", icon: Binoculars },
      { title: "Novo Lead", url: "/leads/new", icon: CirclePlus },
      { title: "Pipeline", url: "/leads/pipeline", icon: Workflow },
      { title: "Tags", url: "/leads/tags", icon: Tag },
    ],
  },
  {
    title: "Imóveis",
    url: "/properties",
    icon: CarFront,
    permission: PERMISSIONS.PROPERTIES_READ,
    subitems: [
      { title: "Listar Imóveis", url: "/properties", icon: Binoculars },
      { title: "Novo Imóvel", url: "/properties/new", icon: CirclePlus },
      { title: "Proprietários", url: "/properties/owners", icon: Users },
    ],
  },
  {
    title: "Negócios",
    url: "/deals",
    icon: WalletMinimal,
    permission: PERMISSIONS.DEALS_READ,
    subitems: [
      { title: "Listar Negócios", url: "/deals", icon: Binoculars },
      { title: "Novo Negócio", url: "/deals/new", icon: CirclePlus },
    ],
  },
  {
    title: "Tarefas",
    url: "/tasks",
    icon: Calendar,
    permission: PERMISSIONS.TASKS_READ,
    subitems: [
      { title: "Listar Tarefas", url: "/tasks", icon: Binoculars },
      { title: "Nova Tarefa", url: "/tasks/new", icon: CirclePlus },
    ],
  },
  {
    title: "WhatsApp",
    url: "/whatsapp",
    icon: MessageSquare,
    permission: PERMISSIONS.LEADS_READ,
    subitems: [
      { title: "Mensagens", url: "/whatsapp/messages", icon: MessageSquare },
      { title: "Configurações", url: "/whatsapp/settings", icon: Settings },
    ],
  },
  {
    title: "Notas",
    url: "/notes",
    icon: StickyNote,
    permission: PERMISSIONS.LEADS_READ,
    subitems: [
      { title: "Todas as Notas", url: "/notes", icon: StickyNote },
    ],
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: ChartPie,
    permission: PERMISSIONS.REPORTS_READ,
    subitems: [
      { title: "Vendas", url: "/reports/sales", icon: TrendingUp },
      { title: "Leads", url: "/reports/leads", icon: Headset },
      { title: "Imóveis", url: "/reports/properties", icon: CarFront },
      { title: "Atividades", url: "/reports/activities", icon: Layers },
    ],
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
    permission: PERMISSIONS.SETTINGS_READ,
    subitems: [
      { title: "Usuários", url: "/settings/users", icon: Users },
      { title: "Planos", url: "/settings/plans", icon: WalletMinimal },
      { title: "Empresa", url: "/settings/tenant", icon: Settings },
      { title: "Permissões", url: "/settings/permissions", icon: Layers },
    ],
  },
];
```

## Mapeamento Schema → Menu

### 1. **Leads** (Lead + Stage + Tag + LeadTag)
- **Menu**: "Leads"
- **Subitens**:
  - Listar Leads → `Lead[]`
  - Novo Lead → `Lead.create`
  - Pipeline → `Stage[]` (estágios do pipeline)
  - Tags → `Tag[]` + `LeadTag[]`

### 2. **Imóveis** (Property + Owner + Address + Media)
- **Menu**: "Imóveis"
- **Subitens**:
  - Listar Imóveis → `Property[]`
  - Novo Imóvel → `Property.create`
  - Proprietários → `Owner[]`

### 3. **Negócios** (Deal)
- **Menu**: "Negócios"
- **Subitens**:
  - Listar Negócios → `Deal[]`
  - Novo Negócio → `Deal.create`

### 4. **Tarefas** (Task)
- **Menu**: "Tarefas"
- **Subitens**:
  - Listar Tarefas → `Task[]`
  - Nova Tarefa → `Task.create`

### 5. **WhatsApp** (WhatsAppAccount + WhatsAppMessage)
- **Menu**: "WhatsApp"
- **Subitens**:
  - Mensagens → `WhatsAppMessage[]`
  - Configurações → `WhatsAppAccount`

### 6. **Notas** (Note)
- **Menu**: "Notas"
- **Subitens**:
  - Todas as Notas → `Note[]`

### 7. **Relatórios** (ActivityLog + agregações)
- **Menu**: "Relatórios"
- **Subitens**:
  - Vendas → `Deal[]` + agregações
  - Leads → `Lead[]` + agregações
  - Imóveis → `Property[]` + agregações
  - Atividades → `ActivityLog[]`

### 8. **Configurações** (User + Tenant + Plan + Subscription)
- **Menu**: "Configurações"
- **Subitens**:
  - Usuários → `User[]`
  - Planos → `Plan[]` + `Subscription[]`
  - Empresa → `Tenant`
  - Permissões → Sistema de permissões

## Permissões por Entidade

### Leads
- **READ**: AGENT, MANAGER, ADMIN, VIEWER
- **CREATE**: AGENT, MANAGER, ADMIN
- **UPDATE**: AGENT, MANAGER, ADMIN
- **DELETE**: MANAGER, ADMIN

### Imóveis
- **READ**: AGENT, MANAGER, ADMIN, VIEWER
- **CREATE**: MANAGER, ADMIN
- **UPDATE**: MANAGER, ADMIN
- **DELETE**: ADMIN

### Negócios
- **READ**: AGENT, MANAGER, ADMIN, VIEWER
- **CREATE**: AGENT, MANAGER, ADMIN
- **UPDATE**: AGENT, MANAGER, ADMIN
- **DELETE**: MANAGER, ADMIN

### Tarefas
- **READ**: AGENT, MANAGER, ADMIN, VIEWER
- **CREATE**: AGENT, MANAGER, ADMIN
- **UPDATE**: AGENT, MANAGER, ADMIN
- **DELETE**: MANAGER, ADMIN

### Usuários
- **READ**: MANAGER, ADMIN
- **CREATE**: ADMIN
- **UPDATE**: MANAGER, ADMIN
- **DELETE**: ADMIN

### Configurações
- **READ**: MANAGER, ADMIN
- **UPDATE**: ADMIN

## URLs e Rotas

### Padrão de URLs
- **Listagem**: `/entidade` (ex: `/leads`, `/properties`)
- **Novo**: `/entidade/new` (ex: `/leads/new`, `/properties/new`)
- **Editar**: `/entidade/:id/edit` (ex: `/leads/123/edit`)
- **Visualizar**: `/entidade/:id` (ex: `/leads/123`)

### Rotas Específicas
- **Pipeline**: `/leads/pipeline` (gerenciamento de estágios)
- **Tags**: `/leads/tags` (gerenciamento de tags)
- **Proprietários**: `/properties/owners` (gerenciamento de proprietários)
- **Mensagens**: `/whatsapp/messages` (mensagens do WhatsApp)
- **Configurações WhatsApp**: `/whatsapp/settings`
- **Notas**: `/notes` (todas as notas do sistema)
- **Relatórios**: `/reports/tipo` (ex: `/reports/sales`, `/reports/leads`)

## Benefícios do Alinhamento

### 1. **Consistência**
- Menu reflete exatamente as entidades do banco
- URLs seguem padrão lógico
- Nomenclatura uniforme

### 2. **Manutenibilidade**
- Mudanças no schema refletem no menu
- Fácil adição de novas entidades
- Estrutura previsível

### 3. **Experiência do Usuário**
- Navegação intuitiva
- Agrupamento lógico de funcionalidades
- Acesso direto às entidades principais

### 4. **Desenvolvimento**
- Estrutura clara para implementação
- Padrões consistentes
- Fácil localização de funcionalidades

## Próximos Passos

### 1. **Implementação das Páginas**
- Criar páginas para cada rota do menu
- Implementar CRUD para cada entidade
- Adicionar validações e permissões

### 2. **Funcionalidades Avançadas**
- Filtros e busca
- Paginação
- Ordenação
- Exportação de dados

### 3. **Integrações**
- WhatsApp Business API
- Sistema de notificações
- Relatórios avançados
- Dashboard com métricas

### 4. **Otimizações**
- Lazy loading
- Cache de dados
- Performance
- Responsividade

O menu agora está completamente alinhado com o schema do Prisma, proporcionando uma base sólida para o desenvolvimento das funcionalidades do sistema.
