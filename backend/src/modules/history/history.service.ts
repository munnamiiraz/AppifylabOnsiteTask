import prisma from '../../config/database';

export class HistoryService {
  static async list(noteId: string, userId: string) {
    const note = await prisma.note.findFirst({
      where: { id: noteId, workspace: { company: { users: { some: { userId } } } } },
    });
    if (!note) throw new Error('Access denied');

    return prisma.noteHistory.findMany({
      where: { noteId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async restore(historyId: string, userId: string) {
    const history = await prisma.noteHistory.findUnique({
      where: { id: historyId },
      include: { note: { include: { workspace: { include: { company: { include: { users: true } } } } } } },
    });

    if (!history || !history.note.workspace.company.users.some(u => u.userId === userId)) {
      throw new Error('Access denied');
    }

    await prisma.noteHistory.create({
      data: {
        noteId: history.noteId,
        title: history.note.title,
        content: history.note.content,
        userId,
      },
    });

    return prisma.note.update({
      where: { id: history.noteId },
      data: { title: history.title, content: history.content },
      include: { tags: { include: { tag: true } }, workspace: { include: { company: true } } },
    });
  }
}
