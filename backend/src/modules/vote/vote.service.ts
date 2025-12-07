import prisma from '../../config/database';

export class VoteService {
  static async vote(data: { noteId: string; voteType: string }, userId?: string, ipAddress?: string) {
    const existing = await prisma.vote.findFirst({
      where: { 
        noteId: data.noteId, 
        OR: userId ? [{ userId }] : [{ ipAddress: ipAddress as string }]
      },
    });

    if (existing && existing.voteType === data.voteType) {
      await prisma.vote.delete({ where: { id: existing.id } });
      return null;
    }

    if (existing) {
      return prisma.vote.update({
        where: { id: existing.id },
        data: { voteType: data.voteType as any },
      });
    }

    return prisma.vote.create({
      data: { noteId: data.noteId, voteType: data.voteType as any, userId, ipAddress },
    });
  }
}