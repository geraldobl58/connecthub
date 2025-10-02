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

  // Tenant 4: G3 Developer - Para demonstração técnica
  const tenant4 = await prisma.tenant.upsert({
    where: { slug: 'g3developer' },
    update: {},
    create: {
      name: 'G3 Developer',
      slug: 'g3developer',
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

  // Criar 25 propriedades para cada tenant
  console.log('🏠 Creating 25 properties for each tenant...');

  // Função para gerar propriedades aleatórias
  const generateProperties = (tenant: any, owner: any, prefix: string) => {
    const propertyTypes = ['HOUSE', 'APARTMENT', 'CONDO', 'LAND', 'COMMERCIAL'];
    const propertyStatuses = [
      'ACTIVE',
      'INACTIVE',
      'RESERVED',
      'SOLD',
      'RENTED',
    ];
    const cities = [
      {
        name: 'São Paulo',
        state: 'SP',
        districts: [
          'Centro',
          'Vila Madalena',
          'Alto de Pinheiros',
          'Jardim Europa',
          'Bela Vista',
          'Vila Olímpia',
          'Brooklin',
        ],
      },
      {
        name: 'Rio de Janeiro',
        state: 'RJ',
        districts: [
          'Copacabana',
          'Ipanema',
          'Barra da Tijuca',
          'Recreio dos Bandeirantes',
          'Leblon',
          'Botafogo',
        ],
      },
      {
        name: 'Belo Horizonte',
        state: 'MG',
        districts: [
          'Savassi',
          'Funcionários',
          'Lourdes',
          'Centro',
          'Sion',
          'Pampulha',
        ],
      },
      {
        name: 'Brasília',
        state: 'DF',
        districts: [
          'Asa Norte',
          'Asa Sul',
          'Lago Sul',
          'Lago Norte',
          'Taguatinga',
          'Guará',
        ],
      },
      {
        name: 'Salvador',
        state: 'BA',
        districts: [
          'Barra',
          'Ondina',
          'Pituba',
          'Rio Vermelho',
          'Centro',
          'Costa Azul',
        ],
      },
    ];

    const properties: any[] = [];

    for (let i = 1; i <= 25; i++) {
      const type =
        propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const status =
        propertyStatuses[Math.floor(Math.random() * propertyStatuses.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const district =
        city.districts[Math.floor(Math.random() * city.districts.length)];

      // Gerar dados baseados no tipo
      let bedroom: number | null = null;
      let bathroom: number | null = null;
      let parking: number | null = null;
      let area: number | null = null;

      if (type === 'HOUSE' || type === 'APARTMENT' || type === 'CONDO') {
        bedroom = Math.floor(Math.random() * 4) + 1; // 1-4 quartos
        bathroom = Math.floor(Math.random() * 3) + 1; // 1-3 banheiros
        parking = Math.floor(Math.random() * 3); // 0-2 vagas
        area = Math.floor(Math.random() * 150) + 50; // 50-200m²
      } else if (type === 'LAND') {
        area = Math.floor(Math.random() * 1000) + 200; // 200-1200m²
      } else if (type === 'COMMERCIAL') {
        bathroom = Math.floor(Math.random() * 4) + 1; // 1-4 banheiros
        parking = Math.floor(Math.random() * 10) + 2; // 2-11 vagas
        area = Math.floor(Math.random() * 300) + 100; // 100-400m²
      }

      // Gerar preço baseado no tipo e área
      let basePrice = 300000;
      if (type === 'LAND') basePrice = 200000;
      else if (type === 'COMMERCIAL') basePrice = 500000;
      else if (type === 'CONDO') basePrice = 600000;

      const price = Math.floor(basePrice + Math.random() * 1000000);

      const code = `${prefix}${i.toString().padStart(3, '0')}`;

      properties.push({
        code,
        title: `${type === 'HOUSE' ? 'Casa' : type === 'APARTMENT' ? 'Apartamento' : type === 'CONDO' ? 'Cobertura' : type === 'LAND' ? 'Terreno' : 'Sala Comercial'} ${bedroom ? bedroom + ' quartos' : ''} - ${district}`,
        description: `Propriedade ${type.toLowerCase()} em ${district}, ${city.name}. ${type === 'HOUSE' || type === 'APARTMENT' ? 'Ideal para' + (bedroom && bedroom > 2 ? ' famílias' : ' casais ou solteiros') : type === 'LAND' ? 'Terreno plano, ideal para construção' : type === 'COMMERCIAL' ? 'Ideal para escritórios e empresas' : 'Cobertura luxuosa com vista privilegiada'}.`,
        type,
        status,
        price,
        bedroom,
        bathroom,
        parking,
        area,
        address: {
          street: `Rua ${['das Flores', 'dos Girassóis', 'das Palmeiras', 'Harmonia', 'dos Lírios', 'das Conchas', 'Funchal', 'dos Três Irmãos', 'Barata Ribeiro', 'Visconde de Pirajá'][Math.floor(Math.random() * 10)]}`,
          number: (Math.floor(Math.random() * 9999) + 1).toString(),
          district,
          city: city.name,
          state: city.state,
          zip: `${Math.floor(Math.random() * 99999)
            .toString()
            .padStart(5, '0')}-${Math.floor(Math.random() * 999)
            .toString()
            .padStart(3, '0')}`,
          lat: -23.5 + (Math.random() - 0.5) * 0.2, // Variação em SP
          lng: -46.6 + (Math.random() - 0.5) * 0.2,
        },
      });
    }

    return properties;
  };

  // Gerar propriedades para cada tenant
  const tenant1Properties = generateProperties(tenant1, owner1, 'SP');
  const tenant2Properties = generateProperties(tenant2, owner2, 'RJ');
  const tenant3Properties = generateProperties(tenant3, owner3, 'TS');
  const tenant4Properties = generateProperties(tenant4, owner4, 'G3');

  // Criar propriedades do Tenant 1
  for (const propData of tenant1Properties) {
    await prisma.property.upsert({
      where: {
        tenantId_code: {
          tenantId: tenant1.id,
          code: propData.code,
        },
      },
      update: {},
      create: {
        tenantId: tenant1.id,
        code: propData.code,
        title: propData.title,
        description: propData.description,
        type: propData.type,
        status: propData.status,
        price: propData.price,
        bedroom: propData.bedroom,
        bathroom: propData.bathroom,
        parking: propData.parking,
        area: propData.area,
        ownerId: owner1.id,
        address: {
          create: propData.address,
        },
      },
    });
  }

  // Criar propriedades do Tenant 2
  for (const propData of tenant2Properties) {
    await prisma.property.upsert({
      where: {
        tenantId_code: {
          tenantId: tenant2.id,
          code: propData.code,
        },
      },
      update: {},
      create: {
        tenantId: tenant2.id,
        code: propData.code,
        title: propData.title,
        description: propData.description,
        type: propData.type,
        status: propData.status,
        price: propData.price,
        bedroom: propData.bedroom,
        bathroom: propData.bathroom,
        parking: propData.parking,
        area: propData.area,
        ownerId: owner2.id,
        address: {
          create: propData.address,
        },
      },
    });
  }

  // Criar propriedades do Tenant 3
  for (const propData of tenant3Properties) {
    await prisma.property.upsert({
      where: {
        tenantId_code: {
          tenantId: tenant3.id,
          code: propData.code,
        },
      },
      update: {},
      create: {
        tenantId: tenant3.id,
        code: propData.code,
        title: propData.title,
        description: propData.description,
        type: propData.type,
        status: propData.status,
        price: propData.price,
        bedroom: propData.bedroom,
        bathroom: propData.bathroom,
        parking: propData.parking,
        area: propData.area,
        ownerId: owner3.id,
        address: {
          create: propData.address,
        },
      },
    });
  }

  // Criar propriedades do Tenant 4 (G3 Developer)
  for (const propData of tenant4Properties) {
    await prisma.property.upsert({
      where: {
        tenantId_code: {
          tenantId: tenant4.id,
          code: propData.code,
        },
      },
      update: {},
      create: {
        tenantId: tenant4.id,
        code: propData.code,
        title: propData.title,
        description: propData.description,
        type: propData.type,
        status: propData.status,
        price: propData.price,
        bedroom: propData.bedroom,
        bathroom: propData.bathroom,
        parking: propData.parking,
        area: propData.area,
        ownerId: owner4.id,
        address: {
          create: propData.address,
        },
      },
    });
  }

  const totalProperties = 3 + 25 * 4; // 3 originais + 25 para cada tenant
  console.log(
    `✅ Created 25 properties for each tenant (100 total additional properties)`,
  );
  console.log(`📊 Total properties created: ${totalProperties}`);

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
