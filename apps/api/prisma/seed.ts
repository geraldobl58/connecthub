import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to hash password
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Helper to generate backup codes
function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    codes.push(code);
  }
  return codes;
}

// Helper to generate random names
const firstNames = [
  'João',
  'Maria',
  'Carlos',
  'Ana',
  'Pedro',
  'Julia',
  'Lucas',
  'Fernanda',
  'Diego',
  'Patricia',
];
const lastNames = [
  'Silva',
  'Santos',
  'Oliveira',
  'Costa',
  'Ferreira',
  'Mendes',
  'Gomes',
  'Sousa',
  'Duarte',
  'Cardoso',
];
const companies = [
  'Tech',
  'Digital',
  'Global',
  'Nexus',
  'Prime',
  'Elite',
  'Quantum',
  'Apex',
  'Summit',
  'Ventures',
];

function getRandomCompanyName(): string {
  const company = companies[Math.floor(Math.random() * companies.length)];
  const suffix = ['LTDA', 'S.A.', 'Consultoria', 'Solutions', 'Serviços'][
    Math.floor(Math.random() * 5)
  ];
  return `${company} ${suffix}`;
}

// Helper to generate unique emails
function generateUniqueEmails(count: number): Set<string> {
  const emails = new Set<string>();
  const domains = [
    'tech.com',
    'digital.com',
    'global.com',
    'solutions.com',
    'services.com',
  ];

  while (emails.size < count) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const randomNum = Math.floor(Math.random() * 100000);

    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
    emails.add(email);
  }

  return emails;
}

function getRandomPhone(): string {
  return `(${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')}) ${String(Math.floor(Math.random() * 99999) + 10000).padStart(5, '0')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
}

function getRandomAddress(): {
  street: string;
  neighborhood: string;
  zipCode: string;
} {
  const streets = [
    'Avenida Paulista',
    'Rua Funchal',
    'Rua Oscar Freire',
    'Av. Brasil',
    'Rua das Flores',
    'Av. Paulista',
    'Rua Augusta',
    'Av. Rebouças',
  ];
  const neighborhoods = [
    'Vila Olímpia',
    'Bela Vista',
    'Cerqueira César',
    'Pinheiros',
    'Itaim Bibi',
    'Consolação',
    'Santa Cecília',
  ];
  const zipCodes = [
    '01311-100',
    '04551-060',
    '01426-100',
    '05454-010',
    '01407-100',
    '01211-020',
    '01330-900',
  ];

  return {
    street: streets[Math.floor(Math.random() * streets.length)],
    neighborhood:
      neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
    zipCode: zipCodes[Math.floor(Math.random() * zipCodes.length)],
  };
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (order matters due to foreign keys)
  await prisma.emailLog.deleteMany();
  console.log('Cleared existing email logs');

  await prisma.passwordReset.deleteMany();
  console.log('Cleared existing password resets');

  await prisma.contract.deleteMany();
  console.log('Cleared existing contracts');

  await prisma.user.deleteMany();
  console.log('Cleared existing users');

  await prisma.client.deleteMany();
  console.log('Cleared existing clients');

  await prisma.subscription.deleteMany();
  console.log('Cleared existing subscriptions');

  await prisma.stripeCheckoutSession.deleteMany();
  console.log('Cleared existing checkout sessions');

  await prisma.tenant.deleteMany();
  console.log('Cleared existing tenants');

  await prisma.plan.deleteMany();
  console.log('Cleared existing plans');

  // ============================
  // Create Plans
  // ============================
  const trialPlan = await prisma.plan.create({
    data: {
      name: 'TRIAL',
      price: 0,
      currency: 'BRL',
      description: 'Comece gratuitamente',
      maxUsers: 4,
      maxContacts: 10,
      hasAPI: false,
      trialDurationHours: 2,
      stripeProductId: null,
      stripePriceId: null,
    },
  });
  console.log('✅ Created TRIAL plan:', trialPlan.id);

  const starterPlan = await prisma.plan.create({
    data: {
      name: 'STARTER',
      price: 149.99,
      currency: 'BRL',
      description: 'Perfeito para começar',
      maxUsers: 4,
      maxContacts: 10,
      hasAPI: false,
      stripeProductId: 'prod_TClbVFQhJS1ZOD',
      stripePriceId: 'price_1SGM3uAB7ykXDk2oUJravQQK',
    },
  });
  console.log('✅ Created STARTER plan:', starterPlan.id);

  const professionalPlan = await prisma.plan.create({
    data: {
      name: 'PROFESSIONAL',
      price: 299.99,
      currency: 'BRL',
      description: 'Para empresas em crescimento',
      maxUsers: 4,
      maxContacts: 20,
      hasAPI: true,
      stripeProductId: 'prod_TClbELPL9wiScE',
      stripePriceId: 'price_1SGM4CAB7ykXDk2ow5PfFVyb',
    },
  });
  console.log('✅ Created PROFESSIONAL plan:', professionalPlan.id);

  const enterprisePlan = await prisma.plan.create({
    data: {
      name: 'ENTERPRISE',
      price: 599.99,
      currency: 'BRL',
      description: 'Solução completa',
      maxUsers: 4,
      maxContacts: 30,
      hasAPI: true,
      stripeProductId: 'prod_TClb1eMmA798TY',
      stripePriceId: 'price_1SGM4TAB7ykXDk2ozLp2ZBgF',
    },
  });
  console.log('✅ Created ENTERPRISE plan:', enterprisePlan.id);

  // ============================
  // Create Test Tenants & Users
  // ============================

  // Test Tenant 1: Startup Company - Active with PROFESSIONAL plan
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'Tech Startup Co',
      slug: 'tech-startup-co',
    },
  });
  console.log('✅ Created Tenant 1:', tenant1.id);

  const user1 = await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      name: 'João Silva',
      email: 'joao@techstartup.com',
      password: await hashPassword('SenhaForte123!@#'),
      isActive: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
      twoFactorEnabled: false,
    },
  });
  console.log('✅ Created User 1 (João):', user1.id);

  const user2 = await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      name: 'Maria Santos',
      email: 'maria@techstartup.com',
      password: await hashPassword('SenhaForte123!@#'),
      isActive: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      twoFactorEnabled: true,
      twoFactorSecret: 'JBSWY3DPEBLW64TMMQ======',
      twoFactorBackupCodes: generateBackupCodes(),
    },
  });
  console.log('✅ Created User 2 (Maria with 2FA):', user2.id);

  const subscription1 = await prisma.subscription.create({
    data: {
      tenantId: tenant1.id,
      planId: professionalPlan.id,
      status: 'ACTIVE',
      startedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      expiresAt: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000), // 275 days from now
      stripeCustomerId: 'cus_test_startup',
      stripeSubscriptionId: 'sub_test_startup_prof',
    },
  });
  console.log('✅ Created Subscription 1 (Tech Startup):', subscription1.id);

  // Test Tenant 2: Small Business - Active with STARTER plan
  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'Digital Agency',
      slug: 'digital-agency',
    },
  });
  console.log('✅ Created Tenant 2:', tenant2.id);

  const user3 = await prisma.user.create({
    data: {
      tenantId: tenant2.id,
      name: 'Carlos Mendes',
      email: 'carlos@digitalagency.com',
      password: await hashPassword('SenhaForte123!@#'),
      isActive: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      twoFactorEnabled: false,
    },
  });
  console.log('✅ Created User 3 (Carlos):', user3.id);

  const subscription2 = await prisma.subscription.create({
    data: {
      tenantId: tenant2.id,
      planId: starterPlan.id,
      status: 'ACTIVE',
      startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      expiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // 335 days from now
      stripeCustomerId: 'cus_test_agency',
      stripeSubscriptionId: 'sub_test_agency_starter',
    },
  });
  console.log('✅ Created Subscription 2 (Digital Agency):', subscription2.id);

  // Test Tenant 3: Enterprise - Active with ENTERPRISE plan
  const tenant3 = await prisma.tenant.create({
    data: {
      name: 'Enterprise Corp',
      slug: 'enterprise-corp',
    },
  });
  console.log('✅ Created Tenant 3:', tenant3.id);

  const user4 = await prisma.user.create({
    data: {
      tenantId: tenant3.id,
      name: 'Ana Costa',
      email: 'ana@enterprisecorp.com',
      password: await hashPassword('SenhaForte123!@#'),
      isActive: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      twoFactorEnabled: true,
      twoFactorSecret: 'JBSWY3DPEBLW64TMMQ======',
      twoFactorBackupCodes: generateBackupCodes(),
    },
  });
  console.log('✅ Created User 4 (Ana with 2FA):', user4.id);

  const user5 = await prisma.user.create({
    data: {
      tenantId: tenant3.id,
      name: 'Roberto Gomes',
      email: 'roberto@enterprisecorp.com',
      password: await hashPassword('SenhaForte123!@#'),
      isActive: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=roberto',
      twoFactorEnabled: false,
    },
  });
  console.log('✅ Created User 5 (Roberto - Inactive):', user5.id);

  const subscription3 = await prisma.subscription.create({
    data: {
      tenantId: tenant3.id,
      planId: enterprisePlan.id,
      status: 'ACTIVE',
      startedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      stripeCustomerId: 'cus_test_enterprise',
      stripeSubscriptionId: 'sub_test_enterprise_ent',
    },
  });
  console.log('✅ Created Subscription 3 (Enterprise Corp):', subscription3.id);

  // Test Tenant 4: Past Due - Subscription expired
  const tenant4 = await prisma.tenant.create({
    data: {
      name: 'Overdue Business',
      slug: 'overdue-business',
    },
  });
  console.log('✅ Created Tenant 4:', tenant4.id);

  const user6 = await prisma.user.create({
    data: {
      tenantId: tenant4.id,
      name: 'Pedro Oliveira',
      email: 'pedro@overduebiz.com',
      password: await hashPassword('SenhaForte123!@#'),
      isActive: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      twoFactorEnabled: false,
    },
  });
  console.log('✅ Created User 6 (Pedro):', user6.id);

  const subscription4 = await prisma.subscription.create({
    data: {
      tenantId: tenant4.id,
      planId: starterPlan.id,
      status: 'PAST_DUE',
      startedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      expiresAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // expired 30 days ago
      stripeCustomerId: 'cus_test_overdue',
      stripeSubscriptionId: 'sub_test_overdue_starter',
    },
  });
  console.log(
    '✅ Created Subscription 4 (Overdue Business):',
    subscription4.id,
  );

  // Test Tenant 5: Canceled Subscription
  const tenant5 = await prisma.tenant.create({
    data: {
      name: 'Former Customer',
      slug: 'former-customer',
    },
  });
  console.log('✅ Created Tenant 5:', tenant5.id);

  const user7 = await prisma.user.create({
    data: {
      tenantId: tenant5.id,
      name: 'Lucas Ferreira',
      email: 'lucas@formercustomer.com',
      password: await hashPassword('SenhaForte123!@#'),
      isActive: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas',
      twoFactorEnabled: false,
    },
  });
  console.log('✅ Created User 7 (Lucas):', user7.id);

  const subscription5 = await prisma.subscription.create({
    data: {
      tenantId: tenant5.id,
      planId: professionalPlan.id,
      status: 'CANCELED',
      startedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
      canceledAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // canceled 60 days ago
      expiresAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // expired 60 days ago
      stripeCustomerId: 'cus_test_canceled',
      stripeSubscriptionId: 'sub_test_canceled_prof',
    },
  });
  console.log('✅ Created Subscription 5 (Former Customer):', subscription5.id);

  // ============================
  // Create Email Logs
  // ============================
  for (let i = 0; i < 15; i++) {
    await prisma.emailLog.create({
      data: {
        tenantId: tenant1.id,
        type: 'LIMIT_ALERT',
        limitType: 'PROPERTIES',
        sentAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000), // Weekly alerts
      },
    });
  }
  console.log('✅ Created 15 email logs for Tech Startup');

  // ============================
  // Create Password Reset Tokens (expired)
  // ============================
  await prisma.passwordReset.create({
    data: {
      userId: user1.id,
      token: 'reset_token_expired_' + Date.now(),
      expiresAt: new Date(Date.now() - 1000 * 60 * 60), // Expired 1 hour ago
      usedAt: null,
    },
  });
  console.log('✅ Created expired password reset token');

  // ============================
  // Create Clients (Associated with Tenants)
  // ============================
  const client1 = await prisma.client.create({
    data: {
      tenantId: tenant1.id,
      name: 'Acme Corporation',
      email: 'contato@acme.com.br',
      address: 'Avenida Paulista',
      number: '1000',
      complement: 'Sala 1200',
      neighborhood: 'Bela Vista',
      zipCode: '01311-100',
      phone: '(11) 3178-8000',
    },
  });
  console.log('✅ Created Client 1 (Acme Corporation):', client1.id);

  const client2 = await prisma.client.create({
    data: {
      tenantId: tenant2.id,
      name: 'Tech Solutions LTDA',
      email: 'vendas@techsolutions.com.br',
      address: 'Rua Funchal',
      number: '500',
      neighborhood: 'Vila Olímpia',
      zipCode: '04551-060',
      phone: '(11) 4002-8922',
    },
  });
  console.log('✅ Created Client 2 (Tech Solutions):', client2.id);

  const client3 = await prisma.client.create({
    data: {
      tenantId: tenant3.id,
      name: 'Global Consulting Group',
      email: 'info@globalconsulting.com.br',
      address: 'Rua Oscar Freire',
      number: '200',
      neighborhood: 'Cerqueira César',
      zipCode: '01426-100',
    },
  });
  console.log('✅ Created Client 3 (Global Consulting):', client3.id);

  const client4 = await prisma.client.create({
    data: {
      tenantId: tenant4.id,
      name: 'OpenSource Solutions',
      email: 'contact@opensource.io',
      address: 'Rua dos Desenvolvedores',
      number: '42',
      neighborhood: 'Vila Madalena',
      zipCode: '05435-040',
      phone: '(11) 9999-8888',
    },
  });
  console.log('✅ Created Client 4 (OpenSource Solutions):', client4.id);

  // ============================
  // Create Contracts (Associated with Tenants and Clients)
  // ============================
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2026-01-01');

  const contract1 = await prisma.contract.create({
    data: {
      tenantId: tenant1.id,
      title: 'Contrato de Prestação de Serviços de Consultoria',
      identifier: 'CTR-2025-001-ACME',
      content:
        'Contrato para prestação de serviços de consultoria tecnológica...',
      initialEffectiveDate: startDate,
      finalEffectiveDate: endDate,
      clientId: client1.id,
      signedAt: new Date('2025-01-05'),
    },
  });
  console.log('✅ Created Contract 1:', contract1.id);

  const contract2 = await prisma.contract.create({
    data: {
      tenantId: tenant2.id,
      title: 'Contrato de Manutenção e Suporte',
      identifier: 'CTR-2025-002-TECH',
      content: 'Contrato para manutenção e suporte técnico de sistemas...',
      initialEffectiveDate: startDate,
      finalEffectiveDate: endDate,
      clientId: client2.id,
      signedAt: new Date('2025-01-10'),
    },
  });
  console.log('✅ Created Contract 2:', contract2.id);

  const contract3 = await prisma.contract.create({
    data: {
      tenantId: tenant3.id,
      title: 'Acordo de Desenvolvimento de Software',
      identifier: 'CTR-2025-003-GLOBAL',
      content: 'Acordo para desenvolvimento de plataforma customizada...',
      initialEffectiveDate: startDate,
      finalEffectiveDate: endDate,
      clientId: client3.id,
    },
  });
  console.log('✅ Created Contract 3:', contract3.id);

  const contract4 = await prisma.contract.create({
    data: {
      tenantId: tenant4.id,
      title: 'Contrato de Licença de Software',
      identifier: 'CTR-2025-004-OPEN',
      content: 'Contrato de licença de uso do software...',
      initialEffectiveDate: startDate,
      finalEffectiveDate: endDate,
      clientId: client4.id,
    },
  });
  console.log('✅ Created Contract 4:', contract4.id);

  // ============================
  // Create 200+ Random Clients for Testing Pagination
  // ============================
  console.log('\n📊 Generating 220 random clients for pagination testing...');

  // Generate unique emails first
  const uniqueEmails = Array.from(generateUniqueEmails(220));
  let emailIndex = 0;

  const clientsToCreate: Array<{
    tenantId: string;
    name: string;
    email: string;
    address: string;
    number: string;
    complement?: string;
    neighborhood: string;
    zipCode: string;
    phone: string;
  }> = [];
  for (let i = 0; i < 220; i++) {
    const address = getRandomAddress();
    clientsToCreate.push({
      tenantId: tenant1.id,
      name: getRandomCompanyName(),
      email: uniqueEmails[emailIndex++],
      address: address.street,
      number: String(Math.floor(Math.random() * 9999) + 1),
      complement:
        Math.random() > 0.5
          ? `Apto ${Math.floor(Math.random() * 999)}`
          : undefined,
      neighborhood: address.neighborhood,
      zipCode: address.zipCode,
      phone: getRandomPhone(),
    });
  }
  await prisma.client.createMany({ data: clientsToCreate });
  console.log(`✅ Created 220 random clients for tenant1`);

  // ============================
  // Create 200+ Random Contracts for Testing Pagination
  // ============================
  console.log('📊 Generating 220 random contracts for pagination testing...');

  // Get all clients for tenant1 to associate with contracts
  const allClients = await prisma.client.findMany({
    where: { tenantId: tenant1.id },
  });

  const contractsToCreate: Array<{
    tenantId: string;
    title: string;
    identifier: string;
    content: string;
    initialEffectiveDate: Date;
    finalEffectiveDate: Date;
    clientId: string;
    signedAt?: Date;
  }> = [];
  const contractTitles = [
    'Contrato de Prestação de Serviços',
    'Contrato de Consultoria Técnica',
    'Contrato de Desenvolvimento de Software',
    'Contrato de Manutenção e Suporte',
    'Contrato de Licença de Software',
    'Acordo de Parceria Comercial',
    'Contrato de Serviços de TI',
    'Contrato de Outsourcing',
    'Contrato de Desenvolvimento Web',
    'Contrato de Integração de Sistemas',
  ];

  for (let i = 0; i < 220; i++) {
    const randomClient =
      allClients[Math.floor(Math.random() * allClients.length)];
    const randomTitle =
      contractTitles[Math.floor(Math.random() * contractTitles.length)];
    const startDate = new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    );
    const endDate = new Date(startDate);
    endDate.setFullYear(
      endDate.getFullYear() + Math.floor(Math.random() * 3) + 1,
    );

    contractsToCreate.push({
      tenantId: tenant1.id,
      title: `${randomTitle} #${String(i + 1).padStart(4, '0')}`,
      identifier: `CTR-${Date.now()}-${String(i).padStart(4, '0')}`,
      content: `Contrato gerado automaticamente para testes de paginação - ID: ${i + 1}`,
      initialEffectiveDate: startDate,
      finalEffectiveDate: endDate,
      clientId: randomClient.id,
      signedAt: Math.random() > 0.3 ? startDate : undefined,
    });
  }
  await prisma.contract.createMany({ data: contractsToCreate });
  console.log(`✅ Created 220 random contracts for tenant1`);

  console.log(
    '✅ Created 3 clients and 4 contracts (all associated with tenants)',
  );

  console.log('\n🌱 Seed completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n1️⃣  Basic User (No 2FA):');
  console.log('   Tenant ID: tech-startup-co');
  console.log('   Email: joao@techstartup.com');
  console.log('   Password: SenhaForte123!@#');
  console.log('   Status: ✅ Active, ❌ No 2FA');

  console.log('\n2️⃣  User with 2FA Enabled:');
  console.log('   Tenant ID: tech-startup-co');
  console.log('   Email: maria@techstartup.com');
  console.log('   Password: SenhaForte123!@#');
  console.log('   Status: ✅ Active, ✅ 2FA Enabled');

  console.log('\n3️⃣  Starter Plan User:');
  console.log('   Tenant ID: digital-agency');
  console.log('   Email: carlos@digitalagency.com');
  console.log('   Password: SenhaForte123!@#');
  console.log('   Status: ✅ Active, ❌ No 2FA');

  console.log('\n4️⃣  Enterprise User (with 2FA):');
  console.log('   Tenant ID: enterprise-corp');
  console.log('   Email: ana@enterprisecorp.com');
  console.log('   Password: SenhaForte123!@#');
  console.log('   Status: ✅ Active, ✅ 2FA Enabled');

  console.log('\n5️⃣  Inactive User:');
  console.log('   Tenant ID: enterprise-corp');
  console.log('   Email: roberto@enterprisecorp.com');
  console.log('   Password: SenhaForte123!@#');
  console.log('   Status: ❌ Inactive');

  console.log('\n6️⃣  Past Due Subscription:');
  console.log('   Tenant ID: overdue-business');
  console.log('   Email: pedro@overduebiz.com');
  console.log('   Password: SenhaForte123!@#');
  console.log('   Status: ⚠️  Past Due');

  console.log('\n7️⃣  Canceled Subscription:');
  console.log('   Tenant ID: former-customer');
  console.log('   Email: lucas@formercustomer.com');
  console.log('   Password: SenhaForte123!@#');
  console.log('   Status: ❌ Canceled');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
