import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const user = await prisma.user.create({
    data: {
      username: 'demo',
      passwordHash: '$2a$10$N9qo8uLOickgx2ZMRZoMye.OjJJCiQ.nfXFjhGg4l2pEEFW/GQhta', // 'demo123'
      role: 'operator'
    }
  });

  // Create A123 battery containers
  const containers = await Promise.all([
    prisma.batteryContainer.create({
      data: {
        name: 'A123-40FT-001',
        capacity: 5.0,
        location: 'New York Substation',
        lat: 40.7614,
        lng: -73.9776,
        status: 'online',
        soc: 85.5,
        soh: 98.2,
        cycleCount: 142,
        productModel: '40ft',
        serialNumber: 'A123-NYC-40-001',
        voltageClass: '1500V'
      }
    }),
    prisma.batteryContainer.create({
      data: {
        name: 'A123-20FT-A-001',
        capacity: 2.5,
        location: 'California Solar Farm',
        lat: 34.0522,
        lng: -118.2437,
        status: 'charging',
        soc: 62.3,
        soh: 96.8,
        cycleCount: 287,
        productModel: '20ft-A',
        serialNumber: 'A123-CA-20A-001',
        voltageClass: '800V'
      }
    }),
    prisma.batteryContainer.create({
      data: {
        name: 'A123-APOWER800-001',
        capacity: 0.8,
        location: 'Texas Industrial Park',
        lat: 29.7604,
        lng: -95.3698,
        status: 'discharging',
        soc: 91.2,
        soh: 99.1,
        cycleCount: 23,
        productModel: 'A-Power-800',
        serialNumber: 'A123-TX-AP800-001',
        voltageClass: '800V'
      }
    }),
    prisma.batteryContainer.create({
      data: {
        name: 'A123-40FT-002',
        capacity: 5.0,
        location: 'Chicago Data Center',
        lat: 41.8781,
        lng: -87.6298,
        status: 'online',
        soc: 77.8,
        soh: 95.3,
        cycleCount: 412,
        productModel: '40ft',
        serialNumber: 'A123-CHI-40-002',
        voltageClass: '1500V'
      }
    }),
    prisma.batteryContainer.create({
      data: {
        name: 'A123-AENERGY850-001',
        capacity: 0.85,
        location: 'Boston Medical Center',
        lat: 42.3601,
        lng: -71.0589,
        status: 'standby',
        soc: 100.0,
        soh: 99.8,
        cycleCount: 8,
        productModel: 'AEnergy-850',
        serialNumber: 'A123-BOS-AE850-001',
        voltageClass: '800V'
      }
    })
  ]);

  // Create performance data for each container
  for (const container of containers) {
    for (let i = 0; i < 10; i++) {
      await prisma.performance.create({
        data: {
          containerId: container.id,
          timestamp: new Date(Date.now() - i * 30 * 60 * 1000), // Every 30 minutes
          generation: Math.random() * container.capacity * 0.9,
          availability: 85 + Math.random() * 15,
          efficiency: 80 + Math.random() * 20
        }
      });
    }
  }

  // Create sample alerts with A123 battery-specific categories
  await prisma.alert.create({
    data: {
      containerId: containers[3].id, // A123-40FT-002
      type: 'thermal',
      severity: 'HIGH',
      category: 'SAFETY',
      message: 'Cell temperature approaching upper threshold - cooling system activated'
    }
  });

  await prisma.alert.create({
    data: {
      containerId: containers[1].id, // A123-20FT-A-001
      type: 'maintenance',
      severity: 'MEDIUM',
      category: 'MAINTENANCE',
      message: 'Scheduled maintenance due in 7 days - BMS firmware update required'
    }
  });

  // Create portfolio record
  await prisma.portfolio.create({
    data: {
      name: 'A123 Fleet Portfolio',
      totalCapacity: containers.reduce((sum, container) => sum + container.capacity, 0),
      currentGeneration: containers.reduce((sum, container) => {
        return sum + (container.status === 'standby' ? 0 : Math.random() * container.capacity * 0.8);
      }, 0)
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });