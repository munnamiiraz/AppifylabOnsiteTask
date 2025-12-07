import dotenv from 'dotenv';
dotenv.config();

import prisma from './config/database';
import bcrypt from 'bcryptjs';

const WORKSPACES_COUNT = 1000;
const NOTES_COUNT = 500000;
const BATCH_SIZE = 1000;

const noteTypes = ['PUBLIC', 'PRIVATE'] as const;
const tagPool = ['javascript', 'typescript', 'react', 'node', 'python', 'java', 'aws', 'docker', 'kubernetes', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest', 'microservices', 'devops', 'ci-cd', 'testing', 'security', 'performance'];

const generateTitle = (index: number) => {
  const prefixes = ['How to', 'Guide to', 'Understanding', 'Best practices for', 'Introduction to', 'Advanced', 'Quick tips on', 'Deep dive into'];
  const topics = ['API design', 'database optimization', 'cloud architecture', 'security patterns', 'performance tuning', 'code review', 'testing strategies', 'deployment automation'];
  return `${prefixes[index % prefixes.length]} ${topics[index % topics.length]} - ${index}`;
};

const generateContent = (index: number) => {
  return `This is a comprehensive note about topic ${index}.\n\nKey points:\n- Point 1: Important concept\n- Point 2: Best practices\n- Point 3: Common pitfalls\n\nConclusion: This note provides valuable insights for developers.\n\nNote ID: ${index}`;
};

async function seed() {
  console.log('Starting seed...');

  console.log('Creating user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: { email: 'admin@example.com', password: hashedPassword, name: 'Admin User' },
  });

  console.log('Creating tags...');
  await prisma.tag.createMany({
    data: tagPool.map(name => ({ name })),
    skipDuplicates: true,
  });
  const tags = await prisma.tag.findMany();

  console.log('Creating companies and workspaces...');
  const companies = [];
  for (let i = 0; i < 100; i++) {
    const company = await prisma.company.create({
      data: {
        name: `Company ${i + 1}`,
        users: { create: { userId: user.id, role: 'owner' } },
      },
    });
    companies.push(company);
  }

  const workspaces = [];
  for (let i = 0; i < WORKSPACES_COUNT; i++) {
    const company = companies[i % companies.length];
    const workspace = await prisma.workspace.create({
      data: { name: `Workspace ${i + 1}`, companyId: company.id },
    });
    workspaces.push(workspace);
    if ((i + 1) % 100 === 0) console.log(`Created ${i + 1} workspaces`);
  }

  console.log('Creating notes in batches...');
  for (let i = 0; i < NOTES_COUNT; i += BATCH_SIZE) {
    const batch = [];
    for (let j = 0; j < BATCH_SIZE && i + j < NOTES_COUNT; j++) {
      const index = i + j;
      const workspace = workspaces[index % workspaces.length];
      const noteType = noteTypes[index % 2];
      const isDraft = index % 10 === 0;
      
      batch.push({
        title: generateTitle(index),
        content: generateContent(index),
        type: noteType,
        isDraft,
        workspaceId: workspace.id,
        publishedAt: !isDraft && noteType === 'PUBLIC' ? new Date() : null,
      });
    }

    await prisma.note.createMany({ data: batch });
    console.log(`Created ${Math.min(i + BATCH_SIZE, NOTES_COUNT)} / ${NOTES_COUNT} notes`);
  }

  console.log('Adding tags to notes...');
  const notes = await prisma.note.findMany({ take: 50000 });
  const noteTags = [];
  for (const note of notes) {
    const numTags = Math.floor(Math.random() * 3) + 1;
    const selectedTags = tags.sort(() => 0.5 - Math.random()).slice(0, numTags);
    for (const tag of selectedTags) {
      noteTags.push({ noteId: note.id, tagId: tag.id });
    }
  }
  
  for (let i = 0; i < noteTags.length; i += BATCH_SIZE) {
    await prisma.noteTag.createMany({
      data: noteTags.slice(i, i + BATCH_SIZE),
      skipDuplicates: true,
    });
    console.log(`Added tags to ${Math.min(i + BATCH_SIZE, noteTags.length)} / ${noteTags.length} note-tag relations`);
  }

  console.log('Seed completed!');
  console.log(`Created: ${companies.length} companies, ${workspaces.length} workspaces, ${NOTES_COUNT} notes`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
