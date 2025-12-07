export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
  _count?: { workspaces: number };
}

export interface Workspace {
  id: string;
  name: string;
  companyId: string;
  company?: Company;
  _count?: { notes: number };
}

export interface Tag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'PUBLIC' | 'PRIVATE';
  isDraft: boolean;
  workspaceId: string;
  workspace?: Workspace;
  tags?: { tag: Tag }[];
  upvotes?: number;
  downvotes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoteHistory {
  id: string;
  noteId: string;
  title: string;
  content: string;
  userId: string;
  user: { name: string; email: string };
  createdAt: string;
}
