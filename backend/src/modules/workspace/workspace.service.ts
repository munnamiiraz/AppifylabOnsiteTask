import prisma from '../../config/database';

export class WorkspaceService {
  static async create(data: { name: string; companyId: string }, userId: string) {
    const hasAccess = await prisma.userCompany.findFirst({
      where: { userId, companyId: data.companyId },
    });
    if (!hasAccess) throw new Error('Access denied');
    return prisma.workspace.create({ data });
  }

  static async list(query: any, userId: string) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 15;
    const skip = (page - 1) * limit;

    const where: any = {
      company: { users: { some: { userId } } },
    };

    if (query.companyId) {
      where.companyId = query.companyId;
    }

    return prisma.workspace.findMany({
      where,
      include: { 
        company: true,
        _count: { select: { notes: true } } 
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }
}
