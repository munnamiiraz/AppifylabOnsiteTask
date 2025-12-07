import prisma from '../../config/database';

export class CompanyService {
  static async create(name: string, userId: string) {
    return prisma.company.create({
      data: {
        name,
        users: { create: { userId, role: 'owner' } },
      },
    });
  }

  static async list(userId: string) {
    return prisma.company.findMany({
      where: { users: { some: { userId } } },
      include: { _count: { select: { workspaces: true } } },
    });
  }
}
