# 🌱 Database Seed

Este seed popula o banco de dados com dados completos de exemplo para desenvolvimento e testes.

## Como executar

```bash
npm run db:seed
```

## O que é criado

### 🏢 **2 Tenants**
- **Empresa Demo** (`empresa-demo`)
- **Imobiliária ABC** (`imobiliaria-abc`)

### 👥 **9 Usuários (todas as roles + testes)**

#### Empresa Demo (5 usuários):
- **Admin**: admin@empresa-demo.com - Carlos Admin (ADMIN)
- **Manager**: manager@empresa-demo.com - Ana Manager (MANAGER)
- **Agent**: agent@empresa-demo.com - Roberto Agent (AGENT)
- **Viewer**: viewer@empresa-demo.com - Julia Viewer (VIEWER)
- **Inactive**: inactive@empresa-demo.com - Pedro Inactive (AGENT, inativo)

#### Imobiliária ABC (4 usuários):
- **Admin**: admin@imobiliaria-abc.com - João Silva (ADMIN)
- **Agent 1**: maria@imobiliaria-abc.com - Maria Santos (AGENT)
- **Agent 2**: lucas@imobiliaria-abc.com - Lucas Oliveira (AGENT)
- **Multi-tenant test**: admin@empresa-demo.com - Carlos Clone (VIEWER)

### 🔐 **Senha padrão para todos os usuários**
```
Demo123!
```

### 💳 **2 Planos**
- **Basic** - R$ 99,99 (5 usuários, 100 imóveis)
- **Pro** - R$ 299,99 (20 usuários, 500 imóveis, API)

### 🏠 **3 Propriedades**
1. **Apartamento 2 quartos** - Centro, São Paulo (R$ 450.000)
2. **Casa 3 quartos** - Jardim das Rosas, São Paulo (R$ 750.000)
3. **Cobertura Duplex** - Barra da Tijuca, Rio de Janeiro (R$ 1.500.000)

### 🎯 **7 Estágios de vendas (para cada tenant)**
1. Novo Lead
2. Qualificado
3. Visita Agendada
4. Proposta Enviada
5. Negociação
6. Fechado (Won)
7. Perdido (Lost)

### 📞 **3 Leads**
- **Roberto Santos** - Interessado em apartamento
- **Fernanda Lima** - Procura casa com quintal
- **Pedro Oliveira** - Interesse em cobertura de luxo

### 📋 **6 Tasks**
- Ligar para Roberto Santos (Pendente, Alta prioridade) - Roberto Agent
- Agendar visita com Fernanda (Pendente) - Roberto Agent
- Enviar fotos da cobertura (Concluída) - Maria Santos
- Revisão mensal de leads (Pendente) - Lucas Oliveira
- Relatório semanal de vendas (Pendente, Baixa) - Julia Viewer

### 🏷️ **3 Tags**
- **VIP** (Dourado)
- **Urgente** (Vermelho)
- **Investidor** (Verde)

### 📝 **Dados adicionais**
- 2 Proprietários
- 4 Notas de exemplo (diferentes autores)
- 2 Logs de atividade
- Endereços completos com coordenadas
- Métricas de uso (Usage)
- Tags associadas aos leads

## 🧪 Como testar

### 1. Teste o Login
```bash
POST /auth/login
{
  "email": "admin@empresa-demo.com",
  "password": "Demo123!",
  "tenantId": "empresa-demo"  # opcional
}
```

### 2. Teste multi-tenancy
- O mesmo email pode existir em tenants diferentes
- Login sem `tenantId` busca o primeiro usuário ativo
- JWT inclui informações do tenant

### 3. Teste usuário inativo
```bash
POST /auth/login
{
  "email": "inactive@empresa-demo.com",
  "password": "Demo123!"
}
# Deve retornar 401 - Invalid credentials
```

### 4. Explore os dados
- Cada tenant tem seu conjunto isolado de dados
- Propriedades têm endereços reais com coordenadas
- Leads estão em diferentes estágios do pipeline
- Tasks com diferentes prioridades e responsáveis
- Tags aplicadas aos leads
- Notes de diferentes autores

## 🔄 Re-executar o seed

O seed usa `upsert`, então pode ser executado múltiplas vezes sem duplicar dados. Para limpar e recriar:

```bash
npx prisma db reset
npm run db:seed
```

## 📊 Estrutura Multi-tenant

Todos os dados respeitam o isolamento por tenant:
- ✅ Users são únicos por tenant + email
- ✅ Properties, Leads, Tasks isolados por tenant
- ✅ Stages personalizáveis por tenant
- ✅ Tags, Notes, Logs isolados por tenant
- ✅ Subscriptions e Usage por tenant

Esta estrutura permite testar completamente o sistema CRM imobiliário multi-tenant!