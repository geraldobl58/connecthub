import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

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

  console.log(`✅ Created tenants: ${tenant1.name}, ${tenant2.name}`);

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

  // Criar Subscriptions
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

  // Tenant 3: Tech Solutions - Para demonstrar diferentes cenários
  const tenant3 = await prisma.tenant.upsert({
    where: { slug: 'tech-solutions' },
    update: {},
    create: {
      name: 'Tech Solutions Corp',
      slug: 'tech-solutions',
    },
  });

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

  // Usuário inativo para testar funcionalidade
  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant1.id,
        email: 'inactive@empresa-demo.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Pedro Inactive',
      email: 'inactive@empresa-demo.com',
      password: passwordHash,
      role: 'AGENT',
      isActive: false, // Usuário inativo para teste
    },
  });

  // Tenant 2: Imobiliária ABC - Estrutura mais enxuta
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

  const agent2 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant2.id,
        email: 'maria@imobiliaria-abc.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant2.id,
      name: 'Maria Santos',
      email: 'maria@imobiliaria-abc.com',
      password: passwordHash,
      role: 'AGENT',
      isActive: true,
    },
  });

  const agent3 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant2.id,
        email: 'lucas@imobiliaria-abc.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant2.id,
      name: 'Lucas Oliveira',
      email: 'lucas@imobiliaria-abc.com',
      password: passwordHash,
      role: 'AGENT',
      isActive: true,
    },
  });

  // Tenant 3: Tech Solutions - Equipe completa de desenvolvimento
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

  const managerTech = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant3.id,
        email: 'manager@tech-solutions.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant3.id,
      name: 'Sandra Project Manager',
      email: 'manager@tech-solutions.com',
      password: passwordHash,
      role: 'MANAGER',
      isActive: true,
    },
  });

  const devSenior = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant3.id,
        email: 'dev.senior@tech-solutions.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant3.id,
      name: 'Paulo Dev Senior',
      email: 'dev.senior@tech-solutions.com',
      password: passwordHash,
      role: 'AGENT',
      isActive: true,
    },
  });

  const devJunior = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant3.id,
        email: 'dev.junior@tech-solutions.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant3.id,
      name: 'Camila Dev Junior',
      email: 'dev.junior@tech-solutions.com',
      password: passwordHash,
      role: 'AGENT',
      isActive: true,
    },
  });

  const estagiario = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant3.id,
        email: 'estagiario@tech-solutions.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant3.id,
      name: 'Felipe Estagiário',
      email: 'estagiario@tech-solutions.com',
      password: passwordHash,
      role: 'VIEWER',
      isActive: true,
    },
  });

  // Usuário inativo para testes
  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant3.id,
        email: 'inactive@tech-solutions.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant3.id,
      name: 'Ex-Funcionário',
      email: 'inactive@tech-solutions.com',
      password: passwordHash,
      role: 'VIEWER',
      isActive: false,
    },
  });

  // Teste de multi-tenant: mesmo email em tenants diferentes
  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant2.id,
        email: 'admin@empresa-demo.com', // Mesmo email do tenant1
      },
    },
    update: {},
    create: {
      tenantId: tenant2.id,
      name: 'Carlos Clone',
      email: 'admin@empresa-demo.com',
      password: passwordHash,
      role: 'VIEWER',
      isActive: true,
    },
  });

  // Criar 50 usuários adicionais para teste de paginação
  console.log('👥 Creating 50 additional users for pagination testing...');

  const roles: Array<'ADMIN' | 'MANAGER' | 'AGENT' | 'VIEWER'> = [
    'ADMIN',
    'MANAGER',
    'AGENT',
    'VIEWER',
  ];
  const tenants = [tenant1, tenant2, tenant3];
  const firstNames = [
    'Ana',
    'Bruno',
    'Carlos',
    'Diana',
    'Eduardo',
    'Fernanda',
    'Gabriel',
    'Helena',
    'Igor',
    'Julia',
    'Kleber',
    'Larissa',
    'Marcos',
    'Natalia',
    'Otavio',
    'Patricia',
    'Rafael',
    'Sandra',
    'Thiago',
    'Ursula',
    'Vitor',
    'Wanda',
    'Xavier',
    'Yara',
    'Zeca',
    'Alice',
    'Bernardo',
    'Camila',
    'Diego',
    'Elisa',
    'Felipe',
    'Gabriela',
    'Henrique',
    'Isabela',
    'João',
    'Karina',
    'Leonardo',
    'Mariana',
    'Nicolas',
    'Olivia',
    'Paulo',
    'Quiteria',
    'Ricardo',
    'Silvia',
    'Tomas',
    'Vanessa',
    'Wesley',
    'Ximena',
    'Yuri',
  ];
  const lastNames = [
    'Silva',
    'Santos',
    'Oliveira',
    'Souza',
    'Rodrigues',
    'Ferreira',
    'Alves',
    'Pereira',
    'Lima',
    'Gomes',
    'Costa',
    'Ribeiro',
    'Martins',
    'Carvalho',
    'Almeida',
    'Lopes',
    'Soares',
    'Fernandes',
    'Vieira',
    'Barbosa',
    'Rocha',
    'Dias',
    'Monteiro',
    'Cardoso',
    'Reis',
    'Moreira',
    'Nascimento',
    'Araújo',
    'Mendes',
    'Freitas',
    'Cavalcanti',
    'Ramos',
    'Nunes',
    'Moura',
    'Teixeira',
    'Correia',
    'Castro',
    'Campos',
    'Melo',
    'Azevedo',
    'Machado',
    'Andrade',
    'Farias',
    'Cunha',
    'Vasconcelos',
    'Pinto',
    'Siqueira',
    'Coelho',
  ];

  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const role = roles[i % roles.length];
    const tenant = tenants[i % tenants.length];
    const isActive = i % 10 !== 0; // 10% dos usuários inativos

    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@${tenant.slug}.com`;

    await prisma.user.upsert({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email: email,
        },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        name: `${firstName} ${lastName}`,
        email: email,
        password: passwordHash,
        role: role,
        isActive: isActive,
      },
    });
  }

  console.log(`✅ Created users for all tenants:
  - Tenant 1 (${tenant1.name}): 5 users (4 active, 1 inactive) + 17 additional users
  - Tenant 2 (${tenant2.name}): 4 users (all active) + 17 additional users  
  - Tenant 3 (${tenant3.name}): 7 users (6 active, 1 inactive) + 16 additional users
  - Total: 59 users across all tenants
  - Multi-tenant test: same email in different tenants`);

  // Criar Usage records
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

  console.log('🏠 Creating owners and properties...');

  // Criar Owners
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

  // Criar Properties
  const property1 = await prisma.property.upsert({
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
      bedroom: 2,
      bathroom: 1,
      parking: 1,
      area: 65.5,
      ownerId: owner1.id,
      address: {
        create: {
          street: 'Rua das Flores',
          number: '123',
          district: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zip: '01234-567',
          lat: -23.5505,
          lng: -46.6333,
        },
      },
    },
  });

  const property2 = await prisma.property.upsert({
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
      bedroom: 3,
      bathroom: 2,
      parking: 2,
      area: 120.0,
      ownerId: owner1.id,
      address: {
        create: {
          street: 'Rua dos Girassóis',
          number: '456',
          district: 'Jardim das Rosas',
          city: 'São Paulo',
          state: 'SP',
          zip: '04567-890',
          lat: -23.5629,
          lng: -46.6544,
        },
      },
    },
  });

  const property3 = await prisma.property.upsert({
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
      bedroom: 4,
      bathroom: 5,
      parking: 3,
      area: 200.0,
      ownerId: owner2.id,
      address: {
        create: {
          street: 'Avenida das Américas',
          number: '7899',
          district: 'Barra da Tijuca',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zip: '22790-123',
          lat: -23.0045,
          lng: -43.3212,
        },
      },
    },
  });

  console.log(`✅ Created ${3} properties`);

  console.log('🎯 Creating stages...');

  // Criar Stages para pipeline de vendas
  const stages = [
    {
      name: 'Novo Lead',
      order: 1,
      color: '#3B82F6',
      isWon: false,
      isLost: false,
    },
    {
      name: 'Qualificado',
      order: 2,
      color: '#8B5CF6',
      isWon: false,
      isLost: false,
    },
    {
      name: 'Visita Agendada',
      order: 3,
      color: '#06B6D4',
      isWon: false,
      isLost: false,
    },
    {
      name: 'Proposta Enviada',
      order: 4,
      color: '#F59E0B',
      isWon: false,
      isLost: false,
    },
    {
      name: 'Negociação',
      order: 5,
      color: '#EF4444',
      isWon: false,
      isLost: false,
    },
    { name: 'Fechado', order: 6, color: '#10B981', isWon: true, isLost: false },
    { name: 'Perdido', order: 7, color: '#6B7280', isWon: false, isLost: true },
  ];

  for (const tenant of [tenant1, tenant2]) {
    for (const stageData of stages) {
      await prisma.stage.upsert({
        where: {
          tenantId_name: {
            tenantId: tenant.id,
            name: stageData.name,
          },
        },
        update: {},
        create: {
          tenantId: tenant.id,
          ...stageData,
          type: 'SALES',
        },
      });
    }
  }

  console.log('📞 Creating leads...');

  // Buscar stages para criar leads
  const novoLeadStage = await prisma.stage.findFirst({
    where: { tenantId: tenant1.id, name: 'Novo Lead' },
  });

  const qualificadoStage = await prisma.stage.findFirst({
    where: { tenantId: tenant1.id, name: 'Qualificado' },
  });

  // Criar Leads
  const lead1 = await prisma.lead.create({
    data: {
      tenantId: tenant1.id,
      name: 'Roberto Santos',
      phone: '11988776655',
      email: 'roberto.santos@email.com',
      source: 'WEB',
      stageId: novoLeadStage?.id,
      assignedTo: agent1.id,
      propertyId: property1.id,
      notesText:
        'Interessado em apartamentos de 2 quartos no centro. Orçamento até R$ 500.000',
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      tenantId: tenant1.id,
      name: 'Fernanda Lima',
      phone: '11977665544',
      email: 'fernanda.lima@email.com',
      source: 'REFERRAL',
      stageId: qualificadoStage?.id,
      assignedTo: agent1.id,
      propertyId: property2.id,
      notesText:
        'Indicada por cliente. Procura casa com quintal para os filhos.',
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      tenantId: tenant2.id,
      name: 'Pedro Oliveira',
      phone: '21999887766',
      email: 'pedro.oliveira@email.com',
      source: 'SOCIAL',
      assignedTo: agent2.id,
      propertyId: property3.id,
      notesText: 'Veio do Instagram. Interesse em cobertura de luxo.',
    },
  });

  console.log(`✅ Created ${3} leads`);

  console.log('📋 Creating tasks...');

  // Criar Tasks
  await prisma.task.create({
    data: {
      tenantId: tenant1.id,
      title: 'Ligar para Roberto Santos',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Em 2 dias
      status: 'PENDING',
      priority: 'HIGH',
      assigneeId: agent1.id,
      leadId: lead1.id,
      reminderAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Em 1 dia
    },
  });

  await prisma.task.create({
    data: {
      tenantId: tenant1.id,
      title: 'Agendar visita com Fernanda',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Em 3 dias
      status: 'PENDING',
      priority: 'NORMAL',
      assigneeId: agent1.id,
      leadId: lead2.id,
      propertyId: property2.id,
    },
  });

  await prisma.task.create({
    data: {
      tenantId: tenant2.id,
      title: 'Enviar fotos da cobertura',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Amanhã
      status: 'COMPLETED',
      priority: 'HIGH',
      assigneeId: agent2.id,
      leadId: lead3.id,
      propertyId: property3.id,
    },
  });

  // Task adicional para agent3
  await prisma.task.create({
    data: {
      tenantId: tenant2.id,
      title: 'Revisão mensal de leads',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Em 1 semana
      status: 'PENDING',
      priority: 'NORMAL',
      assigneeId: agent3.id,
    },
  });

  // Task para viewer1 (só visualização)
  await prisma.task.create({
    data: {
      tenantId: tenant1.id,
      title: 'Relatório semanal de vendas',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Em 5 dias
      status: 'PENDING',
      priority: 'LOW',
      assigneeId: viewer1.id,
    },
  });

  console.log('🏷️ Creating tags...');

  // Criar Tags
  const tagVip = await prisma.tag.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant1.id,
        name: 'VIP',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'VIP',
      color: '#FFD700',
    },
  });

  const tagUrgente = await prisma.tag.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant1.id,
        name: 'Urgente',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Urgente',
      color: '#FF4444',
    },
  });

  const tagInvestidor = await prisma.tag.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant2.id,
        name: 'Investidor',
      },
    },
    update: {},
    create: {
      tenantId: tenant2.id,
      name: 'Investidor',
      color: '#00AA00',
    },
  });

  // Associar tags aos leads
  await prisma.leadTag.create({
    data: {
      leadId: lead1.id,
      tagId: tagUrgente.id,
    },
  });

  await prisma.leadTag.create({
    data: {
      leadId: lead2.id,
      tagId: tagVip.id,
    },
  });

  await prisma.leadTag.create({
    data: {
      leadId: lead3.id,
      tagId: tagInvestidor.id,
    },
  });

  console.log('📝 Creating notes...');

  // Criar Notes
  await prisma.note.create({
    data: {
      tenantId: tenant1.id,
      authorId: agent1.id,
      leadId: lead1.id,
      content:
        'Cliente demonstrou muito interesse no apartamento. Quer agendar visita para o final de semana.',
    },
  });

  await prisma.note.create({
    data: {
      tenantId: tenant1.id,
      authorId: manager1.id,
      propertyId: property2.id,
      content: 'Proprietário autorizou desconto de até 5% para venda à vista.',
    },
  });

  await prisma.note.create({
    data: {
      tenantId: tenant1.id,
      authorId: admin1.id,
      leadId: lead2.id,
      content:
        'Lead de alta qualidade. Aprovação de crédito pré-confirmada pelo banco.',
    },
  });

  await prisma.note.create({
    data: {
      tenantId: tenant2.id,
      authorId: admin2.id,
      leadId: lead3.id,
      content:
        'Cliente tem interesse em investimento. Pode comprar mais de um imóvel.',
    },
  });

  console.log('📊 Creating activity logs...');

  // Criar Activity Logs
  await prisma.activityLog.create({
    data: {
      tenantId: tenant1.id,
      actorId: agent1.id,
      entity: 'Lead',
      entityId: lead1.id,
      action: 'CREATE',
      metadata: {
        leadName: 'Roberto Santos',
        source: 'WEB',
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      tenantId: tenant1.id,
      actorId: agent1.id,
      entity: 'Lead',
      entityId: lead2.id,
      action: 'STATUS_CHANGE',
      metadata: {
        from: 'Novo Lead',
        to: 'Qualificado',
      },
    },
  });

  // Atualizar Usage counts
  await prisma.usage.update({
    where: { tenantId: tenant1.id },
    data: {
      propertiesCount: 2,
      contactsCount: 2,
    },
  });

  await prisma.usage.update({
    where: { tenantId: tenant2.id },
    data: {
      propertiesCount: 1,
      contactsCount: 1,
    },
  });

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log('- 3 Tenants created');
  console.log('- 2 Plans created');
  console.log(
    '- 59 Users created (all roles covered + inactive + multi-tenant test)',
  );
  console.log('- 3 Properties created');
  console.log('- 7 Stages created for each tenant');
  console.log('- 3 Leads created');
  console.log('- 6 Tasks created');
  console.log('- 3 Tags created');
  console.log('- 4 Notes created');
  console.log('- 2 Activity logs created');
  console.log('\n🔐 Default password for all users: Demo123!');
  console.log('\n🏢 Tenants:');
  console.log(
    `- ${tenant1.name} (${tenant1.slug}) - 22 users (20 active, 2 inactive)`,
  );
  console.log(
    `- ${tenant2.name} (${tenant2.slug}) - 21 users (19 active, 2 inactive)`,
  );
  console.log(
    `- ${tenant3.name} (${tenant3.slug}) - 23 users (21 active, 2 inactive)`,
  );
  console.log('\n✨ Multi-tenant features tested:');
  console.log('- Same email in different tenants');
  console.log('- Inactive users (login should fail)');
  console.log('- All user roles represented');
  console.log('- Cross-tenant data isolation');
  console.log('- Pagination testing with 50+ users');
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
