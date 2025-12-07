import prisma from '../../config/database';

export class VoteService {
  static async vote(data: { noteId: string; voteType: string }, userId?: string, ipAddress?: string) {
    await prisma.vote.deleteMany({
      where: { noteId: data.noteId, OR: [{ userId }, { ipAddress }] },
    });

    return prisma.vote.create({
      data: { noteId: data.noteId, voteType: data.voteType as any, userId, ipAddress },
    });
  }
}
