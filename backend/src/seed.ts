import prisma from './config/database';
import bcrypt from 'bcryptjs';

const BATCH_SIZE = 1000;

async function seed() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  });
  console.log('✅ Admin user created');

  // Create 10 companies
  const companies = [];
  for (let i = 1; i <= 10; i++) {
    const company = await prisma.company.create({
      data: {
        name: `Company ${i}`,
        users: { create: { userId: user.id } },
      },
    });
    companies.push(company);
  }
  console.log('✅ 10 companies created');

  // Create 1,000 workspaces (100 per company)
  console.log('🔄 Creating 1,000 workspaces...');
  const workspaces = [];
  for (const company of companies) {
    const batch = [];
    for (let i = 1; i <= 100; i++) {
      batch.push({
        name: `Workspace ${i} - ${company.name}`,
        companyId: company.id,
      });
    }
    const created = await prisma.workspace.createMany({ data: batch });
    const ws = await prisma.workspace.findMany({ where: { companyId: company.id } });
    workspaces.push(...ws);
  }
  console.log('✅ 1,000 workspaces created');

  // Create tags
  const tagNames = ['api', 'design', 'backend', 'frontend', 'database', 'security', 'performance', 'testing', 'documentation', 'deployment'];
  const tags = [];
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags.push(tag);
  }
  console.log('✅ Tags created');

  // Create 500,000 notes in batches
  console.log('🔄 Creating 500,000 notes (this will take 5-10 minutes)...');
  const totalNotes = 500000;
  const notesPerBatch = BATCH_SIZE;
  const batches = Math.ceil(totalNotes / notesPerBatch);

  for (let batch = 0; batch < batches; batch++) {
    const notes = [];
    for (let i = 0; i < notesPerBatch; i++) {
      const noteNum = batch * notesPerBatch + i + 1;
      if (noteNum > totalNotes) break;

      const workspace = workspaces[Math.floor(Math.random() * workspaces.length)];
      const isPublic = Math.random() > 0.3;
      const isDraft = Math.random() > 0.8;

      notes.push({
        title: `Note ${noteNum}: ${isPublic ? 'Public' : 'Private'} ${isDraft ? 'Draft' : 'Published'}`,
        content: `This is the content for note ${noteNum}. It contains detailed information about the topic.\n\nKey points:\n- Point 1\n- Point 2\n- Point 3\n\nConclusion: This note demonstrates the system's capability.`,
        type: isPublic ? 'PUBLIC' : 'PRIVATE',
        isDraft,
        workspaceId: workspace.id,
        publishedAt: !isDraft && isPublic ? new Date() : null,
      });
    }

    await prisma.note.createMany({ data: notes });
    
    const progress = ((batch + 1) / batches * 100).toFixed(1);
    console.log(`   Progress: ${progress}% (${(batch + 1) * notesPerBatch} / ${totalNotes} notes)`);
  }
  console.log('✅ 500,000 notes created');

  // Add tags to random notes
  console.log('🔄 Adding tags to notes...');
  const allNotes = await prisma.note.findMany({ take: 10000 });
  for (const note of allNotes) {
    const numTags = Math.floor(Math.random() * 3) + 1;
    const selectedTags = tags.sort(() => 0.5 - Math.random()).slice(0, numTags);
    
    for (const tag of selectedTags) {
      await prisma.noteTag.create({
        data: { noteId: note.id, tagId: tag.id },
      }).catch(() => {}); // Ignore duplicates
    }
  }
  console.log('✅ Tags added to notes');

  // Add votes to public notes
  console.log('🔄 Adding votes to public notes...');
  const publicNotes = await prisma.note.findMany({ where: { type: 'PUBLIC', isDraft: false }, take: 5000 });
  for (const note of publicNotes) {
    const numVotes = Math.floor(Math.random() * 50);
    for (let i = 0; i < numVotes; i++) {
      await prisma.vote.create({
        data: {
          noteId: note.id,
          voteType: Math.random() > 0.7 ? 'DOWNVOTE' : 'UPVOTE',
          userId: user.id,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        },
      }).catch(() => {}); // Ignore duplicates
    }
  }
  console.log('✅ Votes added');

  console.log('🎉 Seed completed successfully!');
  console.log(`
📊 Summary:
- Users: 1
- Companies: 10
- Workspaces: 1,000
- Notes: 500,000
- Tags: ${tags.length}
- Votes: Added to public notes
  `);
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
