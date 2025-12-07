import dotenv from 'dotenv';
dotenv.config();

import prisma from './config/database';

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Query executed:', result);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
