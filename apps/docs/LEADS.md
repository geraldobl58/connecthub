# 📞 API de Leads - ConnectHub

Sistema completo de gerenciamento de leads para imobiliárias, com funcionalidades avançadas de pipeline, atribuição e rastreamento.

## 🎯 Visão Geral

A API de Leads oferece um sistema robusto para gerenciar o ciclo completo de leads, desde a captação até o fechamento do negócio. Inclui funcionalidades de pipeline configurável, atribuição de agentes, rastreamento de atividades e integração com propriedades.

## 🚀 Funcionalidades Principais

### 📋 CRUD Completo
- ✅ **Criar Lead** - Cadastro com normalização automática de dados
- ✅ **Listar Leads** - Paginação e filtros avançados
- ✅ **Buscar Lead** - Por ID com relacionamentos completos
- ✅ **Atualizar Lead** - Edição com validações
- ✅ **Deletar Lead** - Soft delete para preservar histórico

### 🎯 Pipeline de Vendas
- ✅ **Stages Configuráveis** - Pipeline personalizável por tenant
- ✅ **Movimentação** - Mover leads entre stages com rastreamento
- ✅ **Status Especiais** - Stages de "Ganho" e "Perdido"
- ✅ **Ordem Customizável** - Reordenação de stages

### 👥 Gestão de Agentes
- ✅ **Atribuição** - Atribuir leads a agentes específicos
- ✅ **Remoção** - Desatribuir leads de agentes
- ✅ **Distribuição** - Balanceamento automático de leads
- ✅ **Permissões** - Controle baseado em roles

### 🔍 Busca e Filtros
- ✅ **Busca Geral** - Por nome, telefone ou email
- ✅ **Filtro por Stage** - Leads em stages específicos
- ✅ **Filtro por Agente** - Leads atribuídos a agentes
- ✅ **Filtro por Fonte** - WEB, PHONE, REFERRAL, SOCIAL, OTHER
- ✅ **Busca por Telefone** - Busca exata por número
- ✅ **Busca por Email** - Busca exata por email
- ✅ **Filtro por Tags** - Leads com tags específicas

### 🏷️ Sistema de Tags
- ✅ **Tags Flexíveis** - Sistema de categorização
- ✅ **Cores Personalizadas** - Identificação visual
- ✅ **Múltiplas Tags** - Um lead pode ter várias tags
- ✅ **Filtros por Tag** - Busca por tags específicas

### 📊 Rastreamento e Auditoria
- ✅ **Activity Log** - Registro de todas as ações
- ✅ **Histórico Completo** - Rastreamento de mudanças
- ✅ **Metadados** - Informações contextuais das ações
- ✅ **Timestamps** - Controle temporal de atividades

## 🛠️ Estrutura Técnica

### 📁 Arquivos Principais

```
src/leads/
├── README.md                 # Este arquivo
├── dto/
│   └── leads.dto.ts         # DTOs de validação
├── utils/
│   └── lead.utils.ts        # Utilitários (normalização, formatação)
├── leads.controller.ts      # Endpoints da API
├── leads.service.ts         # Lógica de negócio
└── leads.module.ts          # Módulo NestJS
```

### 🔧 DTOs de Validação

#### CreateLeadDto
```typescript
{
  name: string;              // Nome do lead (obrigatório)
  phone?: string;            // Telefone (normalizado automaticamente)
  email?: string;            // Email (normalizado automaticamente)
  source?: LeadSource;       // Fonte do lead (WEB, PHONE, etc.)
  stageId?: string;          // Stage inicial
  assignedTo?: string;       // Agente atribuído
  notesText?: string;        // Observações
  propertyId?: string;       // Propriedade de interesse
  tags?: string[];           // Tags do lead
}
```

#### UpdateLeadDto
```typescript
{
  // Todos os campos opcionais para atualização parcial
  name?: string;
  phone?: string;
  email?: string;
  source?: LeadSource;
  stageId?: string;
  assignedTo?: string;
  notesText?: string;
  propertyId?: string;
  tags?: string[];
}
```

#### MoveLeadDto
```typescript
{
  stageId: string;           // Novo stage (obrigatório)
  notes?: string;            // Observações da movimentação
}
```

### 🎯 Endpoints da API

#### GET /leads
Lista leads com paginação e filtros
```typescript
Query Parameters:
- search?: string           // Busca geral
- stageId?: string          // Filtro por stage
- assignedTo?: string       // Filtro por agente
- source?: LeadSource       // Filtro por fonte
- phone?: string            // Busca por telefone
- email?: string            // Busca por email
- tags?: string[]           // Filtro por tags
- page?: number             // Página (padrão: 1)
- limit?: number            // Itens por página (padrão: 10)
```

#### GET /leads/:id
Busca lead específico por ID

#### POST /leads
Cria novo lead
```typescript
Body: CreateLeadDto
```

#### PATCH /leads/:id
Atualiza lead existente
```typescript
Body: UpdateLeadDto
```

#### POST /leads/:id/move
Move lead para outro stage
```typescript
Body: MoveLeadDto
```

#### DELETE /leads/:id
Remove lead (soft delete)

#### PATCH /leads/:id/assign
Atribui lead a agente
```typescript
Body: { agentId: string }
```

#### PATCH /leads/:id/unassign
Remove atribuição do lead

## 🔧 Utilitários

### Normalização de Dados

#### Telefone
```typescript
normalizePhone(phone: string): string
// Remove caracteres especiais e valida formato brasileiro
// Aceita: 8, 9, 10 ou 11 dígitos
```

#### Email
```typescript
normalizeEmail(email: string): string
// Remove espaços e converte para minúsculas
```

#### Formatação
```typescript
formatPhone(phone: string): string
// Formata para exibição: (11) 99999-9999
```

### Validações
```typescript
isValidPhone(phone: string): boolean
isValidEmail(email: string): boolean
```

## 📊 Activity Log

### Ações Rastreadas
- ✅ `LEAD_CREATED` - Criação de lead
- ✅ `LEAD_UPDATED` - Atualização de dados
- ✅ `LEAD_MOVED` - Mudança de stage
- ✅ `LEAD_DELETED` - Exclusão (soft delete)
- ✅ `LEAD_ASSIGNED` - Atribuição a agente
- ✅ `LEAD_UNASSIGNED` - Remoção de atribuição

### Estrutura do Log
```typescript
{
  tenantId: string;
  actorId: string;           // Usuário que executou a ação
  entity: "Lead";
  entityId: string;          // ID do lead
  action: string;            // Tipo da ação
  metadata: any;             // Dados contextuais
  createdAt: Date;
}
```

## 🎨 Fontes de Lead

### Tipos Suportados
- **WEB** - Formulários do site
- **PHONE** - Ligações diretas
- **REFERRAL** - Indicações de clientes
- **SOCIAL** - Redes sociais
- **OTHER** - Outras fontes

### Cores por Fonte
```typescript
const sourceColors = {
  WEB: '#3B82F6',      // Azul
  PHONE: '#10B981',    // Verde
  REFERRAL: '#F59E0B', // Amarelo
  SOCIAL: '#8B5CF6',   // Roxo
  OTHER: '#6B7280',    // Cinza
};
```

## 🔒 Segurança e Validações

### Validações de Dados
- ✅ **Nome**: Obrigatório, máximo 100 caracteres
- ✅ **Telefone**: Formato brasileiro, 8-11 dígitos
- ✅ **Email**: Formato válido, opcional
- ✅ **Observações**: Máximo 1000 caracteres
- ✅ **Unicidade**: Telefone e email únicos por tenant

### Controle de Acesso
- ✅ **JWT Authentication** - Autenticação obrigatória
- ✅ **Tenant Isolation** - Dados isolados por tenant
- ✅ **Role-based Permissions** - Controle por permissões
- ✅ **Soft Delete** - Preservação de dados

## 📈 Exemplos de Uso

### Criar Lead
```typescript
POST /leads
{
  "name": "João Silva",
  "phone": "(11) 99999-9999",
  "email": "joao@email.com",
  "source": "WEB",
  "notesText": "Interessado em apartamento 2 quartos"
}
```

### Mover Lead
```typescript
POST /leads/123/move
{
  "stageId": "stage-qualificado-id",
  "notes": "Cliente aprovado para próxima etapa"
}
```

### Atribuir Agente
```typescript
PATCH /leads/123/assign
{
  "agentId": "agent-maria-id"
}
```

### Buscar Leads
```typescript
GET /leads?stageId=novo&source=WEB&page=1&limit=10
```

## 🧪 Dados de Teste

O sistema inclui dados de exemplo no seed:
- ✅ **11 leads** distribuídos entre tenants
- ✅ **Diferentes sources** e stages
- ✅ **Atribuições variadas** a agentes
- ✅ **Activity logs** de exemplo
- ✅ **Tasks vinculadas** aos leads

## 🚀 Próximos Passos

### Funcionalidades Futuras
- [ ] **Notificações** - Alertas para mudanças de stage
- [ ] **Relatórios** - Analytics de conversão
- [ ] **Automação** - Regras de movimentação automática
- [ ] **Integração WhatsApp** - Comunicação direta
- [ ] **Calendário** - Agendamento de visitas
- [ ] **Documentos** - Upload de arquivos

### Melhorias Técnicas
- [ ] **Cache** - Otimização de consultas
- [ ] **Webhooks** - Integrações externas
- [ ] **Bulk Operations** - Operações em lote
- [ ] **Export/Import** - Backup de dados
- [ ] **API Versioning** - Controle de versões

## 📞 Suporte

Para dúvidas ou sugestões sobre a API de Leads:
- 📧 Email: dev@connecthub.com
- 📱 WhatsApp: (11) 99999-9999
- 🐛 Issues: GitHub Issues
- 📖 Docs: Swagger UI (/docs)

---

**Desenvolvido com ❤️ pela equipe ConnectHub**
