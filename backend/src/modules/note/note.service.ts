import prisma from '../../config/database';

export class NoteService {
  static async create(data: any, userId: string) {
    const workspace = await prisma.workspace.findFirst({
      where: { id: data.workspaceId, company: { users: { some: { userId } } } },
    });
    if (!workspace) throw new Error('Access denied');

    return prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        isDraft: data.isDraft,
        workspaceId: data.workspaceId,
        publishedAt: !data.isDraft && data.type === 'PUBLIC' ? new Date() : null,
        tags: data.tags?.length ? {
          create: data.tags.map((tagName: string) => ({
            tag: { connectOrCreate: { where: { name: tagName }, create: { name: tagName } } },
          })),
        } : undefined,
      },
      include: { tags: { include: { tag: true } }, workspace: { include: { company: true } } },
    });
  }

  static async update(id: string, data: any, userId: string) {
    const existingNote = await prisma.note.findFirst({
      where: { id, workspace: { company: { users: { some: { userId } } } } },
    });
    if (!existingNote) throw new Error('Access denied');

    await prisma.noteHistory.create({
      data: {
        noteId: id,
        title: existingNote.title,
        content: existingNote.content,
        userId,
      },
    });

    await prisma.noteTag.deleteMany({ where: { noteId: id } });

    return prisma.note.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        isDraft: data.isDraft,
        publishedAt: !data.isDraft && data.type === 'PUBLIC' && !existingNote.publishedAt ? new Date() : existingNote.publishedAt,
        tags: data.tags?.length ? {
          create: data.tags.map((tagName: string) => ({
            tag: { connectOrCreate: { where: { name: tagName }, create: { name: tagName } } },
          })),
        } : undefined,
      },
      include: { tags: { include: { tag: true } }, workspace: { include: { company: true } } },
    });
  }

  static async delete(id: string, userId: string) {
    const note = await prisma.note.findFirst({
      where: { id, workspace: { company: { users: { some: { userId } } } } },
    });
    if (!note) throw new Error('Access denied');
    await prisma.note.delete({ where: { id } });
  }

  static async listPrivate(query: any, userId: string) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 15;
    const skip = (page - 1) * limit;

    return prisma.note.findMany({
      where: {
        workspace: { company: { users: { some: { userId } } } },
        ...(query.workspaceId && { workspaceId: query.workspaceId }),
        ...(query.search && { title: { contains: query.search, mode: 'insensitive' } }),
      },
      include: {
        tags: { include: { tag: true } },
        workspace: { include: { company: true } },
        _count: { select: { votes: true } },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    });
  }

  static async listPublic(query: any) {
    const sort = query.sort || 'new';
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 15;
    const skip = (page - 1) * limit;
    const orderBy: any = sort === 'old' ? { createdAt: 'asc' } : { createdAt: 'desc' };

    const notes = await prisma.note.findMany({
      where: {
        type: 'PUBLIC',
        isDraft: false,
        ...(query.search && { title: { contains: query.search, mode: 'insensitive' } }),
      },
      include: {
        tags: { include: { tag: true } },
        workspace: { include: { company: true } },
        votes: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    let sortedNotes = notes;
    if (sort === 'upvotes') {
      sortedNotes = notes.sort((a, b) => 
        b.votes.filter(v => v.voteType === 'UPVOTE').length - a.votes.filter(v => v.voteType === 'UPVOTE').length
      );
    } else if (sort === 'downvotes') {
      sortedNotes = notes.sort((a, b) => 
        b.votes.filter(v => v.voteType === 'DOWNVOTE').length - a.votes.filter(v => v.voteType === 'DOWNVOTE').length
      );
    }

    return sortedNotes.map(note => ({
      ...note,
      upvotes: note.votes.filter(v => v.voteType === 'UPVOTE').length,
      downvotes: note.votes.filter(v => v.voteType === 'DOWNVOTE').length,
    }));
  }

  static async getOne(id: string) {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        workspace: { include: { company: true } },
        votes: true,
      },
    });
    if (!note) throw new Error('Not found');
    return {
      ...note,
      upvotes: note.votes.filter(v => v.voteType === 'UPVOTE').length,
      downvotes: note.votes.filter(v => v.voteType === 'DOWNVOTE').length,
    };
  }
}
