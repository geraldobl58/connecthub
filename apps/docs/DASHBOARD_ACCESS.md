# 🚀 Como Acessar o Dashboard - Guia Completo

## 📋 **Passos para Acessar o Dashboard**

### 1. **Iniciar o Servidor**
```bash
cd /home/gera/Development/fullstack/connecthub/apps/application
pnpm dev
```
- O servidor iniciará em `http://localhost:5174` (ou outra porta se 5173 estiver ocupada)

### 2. **Acessar a Aplicação**
- Abra seu navegador em: **`http://localhost:5174`**
- Você será automaticamente redirecionado para a página de login: **`http://localhost:5174/auth/login`**

### 3. **Fazer Login**
Para acessar o dashboard, você precisa fazer login com credenciais válidas:

#### **Credenciais de Teste (qualquer combinação válida):**
- **Email**: Qualquer email válido (ex: `admin@connecthub.com`, `teste@gmail.com`)
- **Senha**: Qualquer senha com pelo menos 6 caracteres (ex: `123456`, `password`)

#### **Exemplo de Login:**
```
Email: admin@connecthub.com
Senha: 123456
```

### 4. **Após o Login**
- ✅ Você será redirecionado automaticamente para: **`http://localhost:5174/dashboard`**
- ✅ O token de autenticação será salvo no `localStorage`
- ✅ Você terá acesso completo ao dashboard

## 🗺️ **Rotas Disponíveis no Dashboard**

Após fazer login, você pode navegar pelas seguintes páginas:

### **Dashboard Principal**
- **URL**: `http://localhost:5174/dashboard`
- **Conteúdo**: Métricas, gráficos, atividades recentes

### **Gestão de Propriedades**
- **URL**: `http://localhost:5174/dashboard/properties`
- **Conteúdo**: Lista e gestão de propriedades

### **Gestão de Usuários**
- **URL**: `http://localhost:5174/dashboard/users`
- **Conteúdo**: Lista e gestão de usuários do sistema

### **Gestão de Planos**
- **URL**: `http://localhost:5174/dashboard/plans`
- **Conteúdo**: Planos de assinatura disponíveis

### **Configurações**
- **URL**: `http://localhost:5174/dashboard/settings`
- **Conteúdo**: Configurações do sistema

## 🔐 **Sistema de Autenticação**

### **Como Funciona:**
1. **Sem Login**: Redirecionamento automático para `/auth/login`
2. **Com Login**: Acesso livre ao dashboard e suas páginas
3. **Token**: Armazenado no `localStorage` como `auth_token`

### **Logout:**
- Clique no ícone de perfil no canto superior direito
- Selecione "Sair" no menu dropdown
- Você será redirecionado para a página de login
- Token será removido automaticamente

## 🎯 **Teste Rápido**

### **Fluxo Completo:**
1. ✅ Acesse `http://localhost:5174`
2. ✅ Digite email: `admin@test.com`
3. ✅ Digite senha: `password123`
4. ✅ Clique em "Entrar"
5. ✅ Navegue pelo dashboard usando a sidebar

### **Navegação:**
- **Sidebar**: Menu lateral com todas as páginas
- **AppBar**: Barra superior com título da página atual
- **Menu de Perfil**: Canto superior direito para logout

## 🔄 **Fluxo de Redirecionamento**

### **Usuário NÃO Autenticado:**
```
/ → /auth/login
/dashboard → /auth/login
/dashboard/users → /auth/login
```

### **Usuário Autenticado:**
```
/ → /dashboard
/auth/login → /dashboard
/auth/register → /dashboard
```

## 🛠️ **Resolução de Problemas**

### **Problema: Não consigo acessar o dashboard**
- ✅ Verifique se fez login corretamente
- ✅ Verifique se o email tem formato válido
- ✅ Verifique se a senha tem pelo menos 6 caracteres
- ✅ Abra as DevTools e veja se há `auth_token` no localStorage

### **Problema: Redirecionado para login sempre**
- ✅ Limpe o localStorage: `localStorage.clear()`
- ✅ Faça login novamente
- ✅ Verifique console para erros

### **Problema: Servidor não inicia**
```bash
# Pare processos na porta
pkill -f :5174

# Reinicie o servidor
pnpm dev
```

## 🎨 **Interface do Dashboard**

### **Layout:**
- **Sidebar**: Navegação principal com ícones
- **AppBar**: Barra superior branca com título
- **Content Area**: Área principal com conteúdo da página
- **Cards**: Métricas e informações organizadas

### **Design Responsivo:**
- **Desktop**: Sidebar fixa + conteúdo principal
- **Mobile**: Sidebar retrátil + menu hambúrguer

## ✨ **Recursos Disponíveis**

### **Dashboard Principal:**
- 📊 Cards com métricas (propriedades, usuários, receita)
- 📈 Área para gráficos de receita
- 📝 Lista de atividades recentes
- 🎨 Design responsivo e moderno

### **Navegação:**
- 🔍 Indicador visual da página atual
- 🎯 Menu de perfil com logout
- 📱 Responsivo para mobile/tablet
- ⚡ Navegação rápida entre páginas

---

## 🚀 **Resumo: Acesso Rápido**

1. **Execute**: `pnpm dev`
2. **Acesse**: `http://localhost:5174`
3. **Login**: Email válido + senha ≥ 6 chars
4. **Dashboard**: Navegue livremente! 🎉

**Credenciais de teste**: `admin@test.com` / `password123`