import { PrismaClient } from  '../../../storecart-backend/src/generated/prisma/client/index.js'

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;

export default prisma;
