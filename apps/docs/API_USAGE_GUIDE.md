# ConnectHub API - Guia Completo de Uso

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Configuração Inicial](#configuração-inicial)
- [Fluxo de Cadastro](#fluxo-de-cadastro)
- [Autenticação](#autenticação)
- [Gerenciamento de Planos](#gerenciamento-de-planos)
- [Pagamentos com Stripe](#pagamentos-com-stripe)
- [Webhooks](#webhooks)
- [Exemplos Práticos](#exemplos-práticos)
- [Códigos de Erro](#códigos-de-erro)

---

## 🎯 Visão Geral

A ConnectHub API oferece um sistema completo de:
- **Multi-tenancy** (cada empresa tem seu próprio espaço)
- **Planos de assinatura** com limites configuráveis
- **Integração com Stripe** para pagamentos
- **Validação automática** de limites de uso
- **Webhooks** para sincronização de status

### 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   API Backend   │────│     Stripe      │
│                 │    │                 │    │                 │
│ • Cadastro      │    │ • Multi-tenant  │    │ • Checkout      │
│ • Dashboard     │    │ • Autenticação  │    │ • Webhooks      │
│ • Pagamentos    │    │ • Validações    │    │ • Billing       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## ⚙️ Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/connecthub"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES="7d"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Email (opcional)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT="587"
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"
```

### 2. Executar Migrações

```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

### 3. Iniciar Servidor

```bash
pnpm start:dev
```

O servidor estará disponível em: `http://localhost:3333`

---

## 🚀 Fluxo de Cadastro

### 1. Listar Planos Disponíveis

**Endpoint:** `GET /plans/available`

```bash
curl -X GET http://localhost:3333/plans/available
```

**Resposta:**
```json
[
  {
    "id": "plan_starter_id",
    "name": "STARTER",
    "price": 149.99,
    "currency": "BRL",
    "maxUsers": 5,
    "maxProperties": 100,
    "maxContacts": 500,
    "hasAPI": false,
    "description": "Plano básico para pequenas empresas"
  },
  {
    "id": "plan_professional_id", 
    "name": "PROFESSIONAL",
    "price": 299.99,
    "currency": "BRL",
    "maxUsers": 20,
    "maxProperties": 500,
    "maxContacts": 2000,
    "hasAPI": true,
    "description": "Plano profissional com API"
  },
  {
    "id": "plan_enterprise_id",
    "name": "ENTERPRISE", 
    "price": 599.99,
    "currency": "BRL",
    "maxUsers": null,
    "maxProperties": null,
    "maxContacts": null,
    "hasAPI": true,
    "description": "Plano enterprise com recursos ilimitados"
  }
]
```

### 2. Cadastrar Nova Empresa

**Endpoint:** `POST /auth/signup`

#### 2.1 Cadastro com Plano Gratuito (STARTER)

```bash
curl -X POST http://localhost:3333/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Minha Empresa",
    "contactName": "João Silva",
    "contactEmail": "joao@minhaempresa.com",
    "domain": "minha-empresa",
    "plan": "STARTER"
  }'
```

**Resposta (Plano Gratuito):**
```json
{
  "success": true,
  "message": "Empresa criada com sucesso. Verifique seu email para acessar sua conta.",
  "tenantId": "tenant_123",
  "checkoutUrl": null,
  "tenant": {
    "id": "tenant_123",
    "name": "Minha Empresa",
    "slug": "minha-empresa"
  },
  "user": {
    "id": "user_123",
    "name": "João Silva",
    "email": "joao@minhaempresa.com",
    "role": "ADMIN"
  },
  "plan": {
    "id": "plan_starter_id",
    "name": "STARTER",
    "price": 149.99,
    "currency": "BRL"
  }
}
```

#### 2.2 Cadastro com Plano Pago (PROFESSIONAL/ENTERPRISE)

```bash
curl -X POST http://localhost:3333/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Tech Solutions Corp",
    "contactName": "Maria Santos",
    "contactEmail": "maria@techsolutions.com",
    "domain": "tech-solutions",
    "plan": "PROFESSIONAL",
    "successUrl": "https://tech-solutions.connecthub.com/success",
    "cancelUrl": "https://tech-solutions.connecthub.com/plans"
  }'
```

**Resposta (Plano Pago):**
```json
{
  "success": true,
  "message": "Empresa criada com sucesso. Complete o pagamento para ativar sua assinatura.",
  "tenantId": "tenant_456",
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_123456789",
  "tenant": {
    "id": "tenant_456",
    "name": "Tech Solutions Corp",
    "slug": "tech-solutions"
  },
  "user": {
    "id": "user_456",
    "name": "Maria Santos",
    "email": "maria@techsolutions.com",
    "role": "ADMIN"
  },
  "plan": {
    "id": "plan_professional_id",
    "name": "PROFESSIONAL",
    "price": 299.99,
    "currency": "BRL"
  }
}
```

### 3. Processo de Pagamento

Para planos pagos, o frontend deve:

1. **Receber a resposta** do signup com `checkoutUrl`
2. **Redirecionar** o usuário para o Stripe Checkout
3. **Aguardar** o retorno na `successUrl` ou `cancelUrl`

```javascript
// Frontend JavaScript
const signupResponse = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(signupData)
});

const result = await signupResponse.json();

if (result.checkoutUrl) {
  // Redirecionar para pagamento
  window.location.href = result.checkoutUrl;
} else {
  // Plano gratuito - pode logar direto
  redirectToLogin();
}
```

---

## 🔐 Autenticação

### 1. Login

**Endpoint:** `POST /auth/login`

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@minhaempresa.com",
    "password": "senha_temporaria",
    "tenantId": "tenant_123"
  }'
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "name": "João Silva",
    "email": "joao@minhaempresa.com",
    "role": "ADMIN",
    "tenant": {
      "id": "tenant_123",
      "name": "Minha Empresa",
      "slug": "minha-empresa"
    }
  }
}
```

### 2. Perfil do Usuário

**Endpoint:** `GET /auth/profile`

```bash
curl -X GET http://localhost:3333/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Resposta:**
```json
{
  "userId": "user_123",
  "name": "João Silva",
  "email": "joao@minhaempresa.com",
  "role": "ADMIN",
  "tenantId": "tenant_123",
  "tenant": {
    "id": "tenant_123",
    "name": "Minha Empresa",
    "slug": "minha-empresa",
    "plan": "STARTER",
    "planExpiresAt": "2024-11-08T14:00:00Z"
  }
}
```

---

## 📦 Gerenciamento de Planos

### 1. Plano Atual

**Endpoint:** `GET /plans/current`

```bash
curl -X GET http://localhost:3333/plans/current \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Resposta:**
```json
{
  "id": "plan_starter_id",
  "name": "STARTER",
  "price": 149.99,
  "currency": "BRL",
  "maxUsers": 5,
  "maxProperties": 100,
  "maxContacts": 500,
  "hasAPI": false,
  "description": "Plano básico para pequenas empresas",
  "planExpiresAt": "2024-11-08T14:00:00Z",
  "createdAt": "2024-10-08T14:00:00Z",
  "status": "ACTIVE"
}
```

### 2. Limites de Uso

**Endpoint:** `GET /plans/usage-limits`

```bash
curl -X GET http://localhost:3333/plans/usage-limits \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Resposta:**
```json
{
  "properties": {
    "current": 25,
    "limit": 100,
    "canAdd": true
  },
  "contacts": {
    "current": 150,
    "limit": 500,
    "canAdd": true
  },
  "api": {
    "enabled": false
  }
}
```

### 3. Upgrade de Plano

**Endpoint:** `POST /plans/upgrade`

#### 3.1 Upgrade Tradicional
```bash
curl -X POST http://localhost:3333/plans/upgrade \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newPlan": "PROFESSIONAL"
  }'
```

#### 3.2 Upgrade via Stripe
```bash
curl -X POST http://localhost:3333/plans/upgrade \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stripePriceId": "price_professional_stripe_id"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Plano atualizado para PROFESSIONAL com sucesso",
  "newPlan": {
    "id": "plan_professional_id",
    "name": "PROFESSIONAL",
    "price": 299.99,
    "currency": "BRL",
    "maxUsers": 20,
    "maxProperties": 500,
    "maxContacts": 2000,
    "hasAPI": true,
    "description": "Plano profissional com API"
  },
  "nextBillingDate": "2024-11-08T14:00:00Z"
}
```

### 4. Cancelar Assinatura

**Endpoint:** `POST /plans/cancel`

```bash
curl -X POST http://localhost:3333/plans/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "message": "Assinatura cancelada com sucesso",
  "effectiveDate": "2024-11-08T14:00:00Z"
}
```

---

## 💳 Pagamentos com Stripe

### 1. Criar Sessão de Checkout

**Endpoint:** `POST /plans/checkout-session`

```bash
curl -X POST http://localhost:3333/plans/checkout-session \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_professional_stripe_id",
    "successUrl": "https://yourapp.com/success",
    "cancelUrl": "https://yourapp.com/cancel"
  }'
```

**Resposta:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_123456789"
}
```

### 2. Portal de Cobrança

**Endpoint:** `POST /plans/billing-portal`

```bash
curl -X POST http://localhost:3333/plans/billing-portal \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "returnUrl": "https://yourapp.com/billing"
  }'
```

**Resposta:**
```json
{
  "url": "https://billing.stripe.com/session/123456789"
}
```

### 3. Validar Assinatura

**Endpoint:** `GET /plans/subscription/validate`

```bash
curl -X GET http://localhost:3333/plans/subscription/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Resposta:**
```json
{
  "valid": true,
  "status": "ACTIVE",
  "expiresAt": "2024-11-08T14:00:00Z"
}
```

---

## 🔗 Webhooks

### Configuração de Webhooks no Stripe

1. **URL do Webhook:** `https://yourapi.com/stripe/webhook`
2. **Eventos necessários:**
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Endpoint de Webhook

**Endpoint:** `POST /stripe/webhook`

Este endpoint recebe automaticamente os eventos do Stripe e atualiza o status das assinaturas no banco de dados.

---

## 🧪 Exemplos Práticos

### Exemplo 1: Cadastro Completo com Plano Pago

```javascript
// 1. Listar planos disponíveis
const plansResponse = await fetch('/api/plans/available');
const plans = await plansResponse.json();

// 2. Fazer cadastro
const signupResponse = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    companyName: "Nova Empresa Ltda",
    contactName: "Pedro Costa",
    contactEmail: "pedro@novaempresa.com", 
    domain: "nova-empresa",
    plan: "PROFESSIONAL",
    successUrl: "https://app.com/success",
    cancelUrl: "https://app.com/plans"
  })
});

const result = await signupResponse.json();

// 3. Redirecionar para pagamento se necessário
if (result.checkoutUrl) {
  window.location.href = result.checkoutUrl;
}
```

### Exemplo 2: Login e Verificação de Limites

```javascript
// 1. Fazer login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "pedro@novaempresa.com",
    password: "senha_temporaria",
    tenantId: "tenant_id"
  })
});

const { access_token } = await loginResponse.json();

// 2. Verificar limites de uso
const limitsResponse = await fetch('/api/plans/usage-limits', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

const limits = await limitsResponse.json();

// 3. Verificar se pode criar mais propriedades
if (!limits.properties.canAdd) {
  // Mostrar modal de upgrade
  showUpgradeModal();
}
```

### Exemplo 3: Upgrade de Plano

```javascript
// 1. Listar planos disponíveis
const plansResponse = await fetch('/api/plans/available');
const plans = await plansResponse.json();

// 2. Fazer upgrade
const upgradeResponse = await fetch('/api/plans/upgrade', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    newPlan: "ENTERPRISE"
  })
});

const result = await upgradeResponse.json();

if (result.success) {
  // Atualizar UI com novo plano
  updatePlanDisplay(result.newPlan);
}
```

---

## ⚠️ Códigos de Erro

### Códigos de Status HTTP

| Código | Descrição          | Ação                  |
| ------ | ------------------ | --------------------- |
| `200`  | Sucesso            | Continuar             |
| `201`  | Criado com sucesso | Continuar             |
| `400`  | Dados inválidos    | Verificar payload     |
| `401`  | Não autorizado     | Fazer login           |
| `403`  | Limite atingido    | Upgrade necessário    |
| `404`  | Não encontrado     | Verificar ID/endpoint |
| `409`  | Conflito           | Recurso já existe     |
| `500`  | Erro interno       | Tentar novamente      |

### Códigos de Erro Específicos

#### Limites de Uso
```json
{
  "statusCode": 403,
  "message": "Limite de propriedades atingido. Máximo: 100",
  "code": "PROPERTY_LIMIT_EXCEEDED", 
  "action": "upgrade_plan",
  "current": 100,
  "limit": 100
}
```

#### Assinatura Inválida
```json
{
  "statusCode": 403,
  "message": "Assinatura expirada ou inválida",
  "code": "SUBSCRIPTION_REQUIRED",
  "action": "renew_subscription"
}
```

#### Domínio em Uso
```json
{
  "statusCode": 409,
  "message": "Este domínio já está em uso",
  "error": "Conflict"
}
```

---

## 🚀 Resumo do Fluxo Completo

1. **📋 Listar Planos** → `GET /plans/available`
2. **📝 Cadastrar Empresa** → `POST /auth/signup`
3. **💳 Pagamento (se necessário)** → Stripe Checkout
4. **🔐 Login** → `POST /auth/login`
5. **👤 Perfil** → `GET /auth/profile`
6. **📊 Verificar Limites** → `GET /plans/usage-limits`
7. **⬆️ Upgrade (se necessário)** → `POST /plans/upgrade`
8. **🏷️ Usar API** → Recursos com validação automática

### Status de Assinatura

| Status     | Descrição           | Ações Disponíveis      |
| ---------- | ------------------- | ---------------------- |
| `ACTIVE`   | Assinatura ativa    | Usar normalmente       |
| `PENDING`  | Pagamento pendente  | Aguardar confirmação   |
| `PAST_DUE` | Pagamento em atraso | Renovar pagamento      |
| `CANCELED` | Cancelada           | Reativar ou criar nova |
| `EXPIRED`  | Expirada            | Renovar assinatura     |

---

## 🛠️ Ferramentas de Desenvolvimento

### Teste Local com Stripe CLI

```bash
# Instalar Stripe CLI
npm install -g stripe-cli

# Login no Stripe
stripe login

# Escutar webhooks localmente
stripe listen --forward-to localhost:3333/stripe/webhook
```

### Swagger/OpenAPI

Acesse a documentação interativa em:
`http://localhost:3333/api` (quando disponível)

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs da aplicação
2. Consulte a documentação do Stripe
3. Verifique os webhooks no dashboard do Stripe
4. Consulte os códigos de erro acima

---

**🎉 Sua API ConnectHub está pronta para integração!**