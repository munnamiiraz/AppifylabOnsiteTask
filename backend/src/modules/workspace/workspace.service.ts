import prisma from '../../config/database';

export class WorkspaceService {
  static async create(data: { name: string; companyId: string }, userId: string) {
    const hasAccess = await prisma.userCompany.findFirst({
      where: { userId, companyId: data.companyId },
    });
    if (!hasAccess) throw new Error('Access denied');
    return prisma.workspace.create({ data });
  }

  static async list(companyId: string, userId: string) {
    return prisma.workspace.findMany({
      where: {
        companyId,
        company: { users: { some: { userId } } },
      },
      include: { _count: { select: { notes: true } } },
    });
  }
}
