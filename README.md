# ConnectHub - Sistema de Gestão Imobiliária

ConnectHub é uma plataforma completa de gestão imobiliária construída com Next.js, NestJS e integração com Stripe para pagamentos e gestão de planos.

## 🏗️ Arquitetura do Projeto

Este monorepo inclui as seguintes aplicações e pacotes:

### Apps
- `api`: API NestJS com integração Stripe, sistema de permissões e multi-tenant
- `web`: Aplicação Next.js para interface do usuário
- `docs`: Documentação da aplicação

### Pacotes
- `@repo/ui`: Biblioteca de componentes React compartilhada
- `@repo/eslint-config`: Configurações ESLint
- `@repo/typescript-config`: Configurações TypeScript

## 🚀 Configuração Inicial

### 1. Pré-requisitos
- Node.js 18+
- PostgreSQL
- Conta no Stripe (para pagamentos)

### 2. Setup Rápido

```bash
# Clone o repositório
git clone https://github.com/geraldobl58/connecthub.git
cd connecthub

# Execute o script de configuração automática
./setup.sh
```

O script irá:
- ✅ Instalar dependências
- ✅ Criar arquivo .env
- ✅ Configurar Prisma
- ✅ Executar migrations (opcional)
- ✅ Executar seed (opcional)

### 3. Configuração Manual (Alternativa)

#### 3.1 Clone o repositório
```bash
git clone https://github.com/geraldobl58/connecthub.git
cd connecthub
```

#### 3.2 Instale as dependências
```bash
pnpm install
```

#### 3.3 Configure as variáveis de ambiente

**API (apps/api/.env):**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/connecthub?schema=public"

# JWT
JWT_SECRET="your-jwt-secret-key"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# App Configuration
APP_URL="http://localhost:3000"
API_URL="http://localhost:3001"
```

### 4. Configuração do Stripe

📋 **Use o checklist**: [STRIPE_SETUP_CHECKLIST.md](STRIPE_SETUP_CHECKLIST.md)

#### 4.1. Criar Produtos e Preços no Stripe Dashboard

1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá para **Produtos** → **Criar produto**
3. Crie os seguintes produtos:

#### Plano Basic
- **Nome**: Basic Plan
- **Descrição**: Plano básico para pequenas empresas
- **Preço**: R$ 99,99/mês
- **ID do Preço**: Anote o `price_id` gerado (ex: `price_1234567890`)

#### Plano Professional
- **Nome**: Professional Plan
- **Descrição**: Plano profissional com API
- **Preço**: R$ 299,99/mês
- **ID do Preço**: Anote o `price_id` gerado

#### Plano Enterprise
- **Nome**: Enterprise Plan
- **Descrição**: Plano enterprise com recursos ilimitados
- **Preço**: R$ 999,99/mês
- **ID do Preço**: Anote o `price_id` gerado

#### 4.2. Configurar Webhooks

1. No Stripe Dashboard, vá para **Desenvolvedores** → **Webhooks**
2. Clique em **Adicionar endpoint**
3. Configure:
   - **URL do endpoint**: `https://your-api-domain.com/stripe/webhook`
   - **Eventos para escutar**:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

4. Após criar o webhook, copie o **Signing secret** (começa com `whsec_`)
5. Adicione este valor na variável `STRIPE_WEBHOOK_SECRET` no seu arquivo `.env`

#### 4.3. Obter Chaves de API

1. No Stripe Dashboard, vá para **Desenvolvedores** → **Chaves de API**
2. Copie:
   - **Chave secreta** (começa com `sk_test_` ou `sk_live_`) → `STRIPE_SECRET_KEY`
   - **Chave publicável** (começa com `pk_test_` ou `pk_live_`) → `STRIPE_PUBLISHABLE_KEY`

#### 4.4. Atualizar Seed Script

Após criar os produtos no Stripe, atualize o arquivo `apps/api/prisma/seed.ts` com os IDs reais:

```typescript
// Substitua pelos IDs reais do Stripe
const basicPlan = await prisma.plan.upsert({
  where: { name: 'Basic' },
  update: {},
  create: {
    name: 'Basic',
    price: 99.99,
    currency: 'BRL',
    maxUsers: 5,
    maxProperties: 100,
    maxContacts: 500,
    hasAPI: false,
    description: 'Plano básico para pequenas empresas',
    stripeProductId: 'prod_XXXXXXXXXX', // ID do produto no Stripe
    stripePriceId: 'price_XXXXXXXXXX',   // ID do preço no Stripe
  },
});
```

## 🗄️ Configuração do Banco de Dados

```bash
# Navegar para a API
cd apps/api

# Executar migrations
npx prisma migrate dev

# Executar seed (após configurar IDs do Stripe)
npm run db:seed

# Visualizar dados (opcional)
npx prisma studio
```

## 📋 Arquivos de Referência

- 📄 [STRIPE_INTEGRATION.md](apps/api/STRIPE_INTEGRATION.md) - Documentação completa da integração
- ✅ [STRIPE_SETUP_CHECKLIST.md](STRIPE_SETUP_CHECKLIST.md) - Checklist de configuração
- 🛠️ [setup.sh](setup.sh) - Script de configuração automática

## 🚀 Executando o Projeto

### Desenvolvimento

Para executar todas as aplicações em modo de desenvolvimento:

```bash
# Na raiz do projeto
pnpm dev
```

Para executar aplicações específicas:

```bash
# Apenas a API
pnpm dev --filter=api

# Apenas o frontend
pnpm dev --filter=web
```

### Build

Para fazer build de todas as aplicações:

```bash
pnpm build
```

Para build de aplicações específicas:

```bash
# Build da API
pnpm build --filter=api

# Build do frontend
pnpm build --filter=web
```

## 📚 Documentação

### API Endpoints

#### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/signup` - Cadastro de novo usuário

#### Planos e Pagamentos
- `GET /plans/available` - Listar planos disponíveis
- `GET /plans/current` - Plano atual do tenant
- `POST /plans/checkout-session` - Criar sessão de checkout Stripe
- `POST /plans/billing-portal` - Portal de cobrança Stripe
- `POST /plans/upgrade` - Upgrade de plano (tradicional ou Stripe)
- `GET /plans/usage-limits` - Verificar limites de uso

#### Propriedades
- `GET /properties` - Listar propriedades
- `POST /properties` - Criar propriedade (com validação de limites)
- `PUT /properties/:id` - Atualizar propriedade
- `DELETE /properties/:id` - Excluir propriedade

#### Webhooks
- `POST /stripe/webhook` - Webhook do Stripe (não requer autenticação)

### Validação de Limites

O sistema valida automaticamente os limites do plano:

```typescript
// Exemplo: Criar propriedade
const response = await fetch('/api/properties', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: 'PROP001',
    title: 'Casa Nova',
    // ... outros campos
  })
});

// Se limite atingido, retorna 403
if (response.status === 403) {
  const error = await response.json();
  if (error.code === 'PROPERTY_LIMIT_EXCEEDED') {
    // Redirecionar para upgrade
    window.location.href = '/upgrade';
  }
}
```

## 🛡️ Segurança

### Middleware de Validação

O sistema inclui middleware automático para:
- **Autenticação JWT**: Valida tokens em rotas protegidas
- **Validação de Assinatura**: Verifica se o plano está ativo
- **Limites de Uso**: Bloqueia criação de recursos quando limite atingido

### Rotas Isentas de Validação

As seguintes rotas não requerem validação de plano:
- `/auth/*` - Autenticação
- `/stripe/webhook` - Webhooks do Stripe
- `/plans/*` - Gestão de planos

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Webhook não funciona
```bash
# Verificar se a URL está acessível
curl -X POST https://your-api-domain.com/stripe/webhook

# Verificar logs da API
pnpm dev --filter=api
```

#### 2. Assinatura não atualiza
- Verificar se `STRIPE_WEBHOOK_SECRET` está correto
- Verificar se os metadados no Stripe contêm `tenantId`
- Verificar logs no Stripe Dashboard

#### 3. Limites não funcionam
- Verificar se a tabela `Usage` está sendo atualizada
- Verificar se o `PlansModule` está importado nos módulos necessários

#### 4. Checkout falha
- Verificar se o customer foi criado no Stripe
- Verificar se os IDs de preço estão corretos
- Verificar variáveis de ambiente do Stripe

### Logs e Monitoramento

```bash
# Logs da API
cd apps/api
npm run start:dev

# Logs do banco de dados
npx prisma studio

# Verificar assinaturas ativas
psql -d connecthub -c "SELECT COUNT(*) FROM \"Subscription\" WHERE status = 'ACTIVE';"
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links Úteis

- [Documentação do Stripe](https://stripe.com/docs)
- [Documentação do NestJS](https://nestjs.com/)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Prisma](https://www.prisma.io/docs)
