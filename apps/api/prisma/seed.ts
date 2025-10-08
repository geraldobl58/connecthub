import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Criar Plans
  console.log('💳 Creating plans...');
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
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { name: 'Pro' },
    update: {},
    create: {
      name: 'Pro',
      price: 299.99,
      currency: 'BRL',
      maxUsers: 20,
      maxProperties: 500,
      maxContacts: 2000,
      hasAPI: true,
      description: 'Plano profissional com API',
    },
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { name: 'Enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      price: 999.99,
      currency: 'BRL',
      maxUsers: -1, // Ilimitado
      maxProperties: -1, // Ilimitado
      maxContacts: -1, // Ilimitado
      hasAPI: true,
      description: 'Plano enterprise com recursos ilimitados',
    },
  });

  console.log(
    `✅ Created plans: ${basicPlan.name}, ${proPlan.name}, ${enterprisePlan.name}`,
  );

  // Criar Tenants
  console.log('📊 Creating tenants...');
  const tenant1 = await prisma.tenant.upsert({
    where: { slug: 'empresa-demo' },
    update: {},
    create: {
      name: 'Empresa Demo',
      slug: 'empresa-demo',
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'imobiliaria-abc' },
    update: {},
    create: {
      name: 'Imobiliária ABC',
      slug: 'imobiliaria-abc',
    },
  });

  const tenant3 = await prisma.tenant.upsert({
    where: { slug: 'tech-solutions' },
    update: {},
    create: {
      name: 'Tech Solutions Corp',
      slug: 'tech-solutions',
    },
  });

  const tenant4 = await prisma.tenant.upsert({
    where: { slug: 'g3developer' },
    update: {},
    create: {
      name: 'G3 Developer',
      slug: 'g3developer',
    },
  });

  console.log(
    `✅ Created tenants: ${tenant1.name}, ${tenant2.name}, ${tenant3.name}, ${tenant4.name}`,
  );

  // Criar Subscriptions
  console.log('🔄 Creating subscriptions...');
  await prisma.subscription.upsert({
    where: { tenantId: tenant1.id },
    update: {},
    create: {
      tenantId: tenant1.id,
      planId: basicPlan.id,
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
    },
  });

  await prisma.subscription.upsert({
    where: { tenantId: tenant2.id },
    update: {},
    create: {
      tenantId: tenant2.id,
      planId: proPlan.id,
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
    },
  });

  await prisma.subscription.upsert({
    where: { tenantId: tenant3.id },
    update: {},
    create: {
      tenantId: tenant3.id,
      planId: enterprisePlan.id,
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
    },
  });

  await prisma.subscription.upsert({
    where: { tenantId: tenant4.id },
    update: {},
    create: {
      tenantId: tenant4.id,
      planId: proPlan.id,
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
    },
  });

  console.log('✅ Created subscriptions for all tenants');

  // Criar Usage records
  console.log('📊 Creating usage records...');
  await prisma.usage.upsert({
    where: { tenantId: tenant1.id },
    update: {},
    create: {
      tenantId: tenant1.id,
      propertiesCount: 0,
      contactsCount: 0,
    },
  });

  await prisma.usage.upsert({
    where: { tenantId: tenant2.id },
    update: {},
    create: {
      tenantId: tenant2.id,
      propertiesCount: 0,
      contactsCount: 0,
    },
  });

  await prisma.usage.upsert({
    where: { tenantId: tenant3.id },
    update: {},
    create: {
      tenantId: tenant3.id,
      propertiesCount: 0,
      contactsCount: 0,
    },
  });

  await prisma.usage.upsert({
    where: { tenantId: tenant4.id },
    update: {},
    create: {
      tenantId: tenant4.id,
      propertiesCount: 0,
      contactsCount: 0,
    },
  });

  console.log('✅ Created usage records for all tenants');

  // Criar Users com todas as roles
  console.log('👥 Creating users...');
  const passwordHash = await hash('Demo123!', 10);

  // Tenant 1: Empresa Demo - Usuários completos para demonstração
  const admin1 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant1.id,
        email: 'admin@empresa-demo.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Carlos Admin',
      email: 'admin@empresa-demo.com',
      password: passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });

  const manager1 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant1.id,
        email: 'manager@empresa-demo.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Ana Manager',
      email: 'manager@empresa-demo.com',
      password: passwordHash,
      role: 'MANAGER',
      isActive: true,
    },
  });

  const agent1 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant1.id,
        email: 'agent@empresa-demo.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Roberto Agent',
      email: 'agent@empresa-demo.com',
      password: passwordHash,
      role: 'AGENT',
      isActive: true,
    },
  });

  const viewer1 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant1.id,
        email: 'viewer@empresa-demo.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Julia Viewer',
      email: 'viewer@empresa-demo.com',
      password: passwordHash,
      role: 'VIEWER',
      isActive: true,
    },
  });

  // Tenant 2: Imobiliária ABC
  const admin2 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant2.id,
        email: 'admin@imobiliaria-abc.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant2.id,
      name: 'João Silva',
      email: 'admin@imobiliaria-abc.com',
      password: passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });

  // Tenant 3: Tech Solutions
  const adminTech = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant3.id,
        email: 'admin@tech-solutions.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant3.id,
      name: 'Roberto CTO',
      email: 'admin@tech-solutions.com',
      password: passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });

  // Tenant 4: G3 Developer
  const adminG3 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant4.id,
        email: 'admin@g3developer.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant4.id,
      name: 'G3 Administrator',
      email: 'admin@g3developer.com',
      password: passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(
    `✅ Created users: ${admin1.name}, ${manager1.name}, ${agent1.name}, ${viewer1.name}, ${admin2.name}, ${adminTech.name}, ${adminG3.name}`,
  );

  // Criar Owners
  console.log('🏠 Creating owners...');
  const owner1 = await prisma.owner.create({
    data: {
      tenantId: tenant1.id,
      name: 'Carlos Silva',
      phone: '11999887766',
      email: 'carlos.silva@email.com',
      notes: 'Proprietário muito cordial, prefere contato por WhatsApp',
    },
  });

  const owner2 = await prisma.owner.create({
    data: {
      tenantId: tenant2.id,
      name: 'Ana Costa',
      phone: '21987654321',
      email: 'ana.costa@email.com',
    },
  });

  const owner3 = await prisma.owner.create({
    data: {
      tenantId: tenant3.id,
      name: 'Tech Solutions Corp',
      phone: '1133334444',
      email: 'contato@techsolutions.com',
      notes: 'Empresa de tecnologia, interessada em propriedades comerciais',
    },
  });

  const owner4 = await prisma.owner.create({
    data: {
      tenantId: tenant4.id,
      name: 'G3 Developer Properties',
      phone: '1199998888',
      email: 'properties@g3developer.com',
      notes: 'Propriedades para demonstração e desenvolvimento',
    },
  });

  console.log(
    `✅ Created owners: ${owner1.name}, ${owner2.name}, ${owner3.name}, ${owner4.name}`,
  );

  // Criar Properties
  console.log('🏘️ Creating properties...');

  await prisma.property.upsert({
    where: {
      tenantId_code: {
        tenantId: tenant1.id,
        code: 'APTO001',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      code: 'APTO001',
      title: 'Apartamento 2 quartos - Centro',
      description:
        'Lindo apartamento no centro da cidade, com 2 quartos, sala, cozinha e banheiro. Próximo ao metrô.',
      type: 'APARTMENT',
      status: 'ACTIVE',
      price: 450000.0,
      minPrice: 420000.0,
      maxPrice: 480000.0,
      bedroom: 2,
      bathroom: 1,
      parking: 1,
      area: 65.5,
      ownerId: owner1.id,
      address: {
        street: 'Rua das Flores',
        number: '123',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zip: '01234-567',
        lat: -23.5505,
        lng: -46.6333,
      },
      coverImage: 'https://picsum.photos/800/600?random=1',
      galleryImages: [
        'https://picsum.photos/800/600?random=2',
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
      ],
    },
  });

  await prisma.property.upsert({
    where: {
      tenantId_code: {
        tenantId: tenant1.id,
        code: 'CASA001',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      code: 'CASA001',
      title: 'Casa 3 quartos - Jardim das Rosas',
      description:
        'Casa espaçosa com quintal, 3 quartos, 2 banheiros, garagem para 2 carros.',
      type: 'HOUSE',
      status: 'ACTIVE',
      price: 750000.0,
      minPrice: 700000.0,
      maxPrice: 800000.0,
      bedroom: 3,
      bathroom: 2,
      parking: 2,
      area: 120.0,
      ownerId: owner1.id,
      address: {
        street: 'Rua dos Girassóis',
        number: '456',
        district: 'Jardim das Rosas',
        city: 'São Paulo',
        state: 'SP',
        zip: '04567-890',
        lat: -23.5629,
        lng: -46.6544,
      },
      coverImage: 'https://picsum.photos/800/600?random=5',
      galleryImages: [
        'https://picsum.photos/800/600?random=6',
        'https://picsum.photos/800/600?random=7',
      ],
    },
  });

  await prisma.property.upsert({
    where: {
      tenantId_code: {
        tenantId: tenant2.id,
        code: 'COND001',
      },
    },
    update: {},
    create: {
      tenantId: tenant2.id,
      code: 'COND001',
      title: 'Cobertura Duplex - Barra da Tijuca',
      description:
        'Cobertura luxuosa com vista para o mar, piscina privativa, 4 suítes.',
      type: 'CONDO',
      status: 'ACTIVE',
      price: 1500000.0,
      minPrice: 1400000.0,
      maxPrice: 1600000.0,
      bedroom: 4,
      bathroom: 5,
      parking: 3,
      area: 200.0,
      ownerId: owner2.id,
      address: {
        street: 'Avenida das Américas',
        number: '7899',
        district: 'Barra da Tijuca',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zip: '22790-123',
        lat: -23.0045,
        lng: -43.3212,
      },
      coverImage: 'https://picsum.photos/800/600?random=8',
      galleryImages: [
        'https://picsum.photos/800/600?random=9',
        'https://picsum.photos/800/600?random=10',
        'https://picsum.photos/800/600?random=11',
      ],
    },
  });

  console.log('✅ Created 3 initial properties');

  // Atualizar contadores de usage
  await prisma.usage.update({
    where: { tenantId: tenant1.id },
    data: { propertiesCount: 2 },
  });

  await prisma.usage.update({
    where: { tenantId: tenant2.id },
    data: { propertiesCount: 1 },
  });

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log('- 4 Tenants created');
  console.log('- 3 Plans created (Basic, Pro, Enterprise)');
  console.log('- 4 Subscriptions created (all ACTIVE)');
  console.log('- 4 Usage records created');
  console.log('- 7 Users created (all roles covered)');
  console.log('- 4 Owners created');
  console.log('- 3 Properties created');
  console.log('\n🔐 Default password for all users: Demo123!');
  console.log('\n🏢 Tenants:');
  console.log(
    `- ${tenant1.name} (${tenant1.slug}) - Plan: ${basicPlan.name}`,
  );
  console.log(`- ${tenant2.name} (${tenant2.slug}) - Plan: ${proPlan.name}`);
  console.log(
    `- ${tenant3.name} (${tenant3.slug}) - Plan: ${enterprisePlan.name}`,
  );
  console.log(`- ${tenant4.name} (${tenant4.slug}) - Plan: ${proPlan.name}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
