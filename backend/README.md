# SaaS Notes System - Backend

## Database Design

### Entity Relationship Diagram

```
User (1) ----< (M) UserCompany (M) >---- (1) Company
                                              |
                                              | (1)
                                              |
                                              v
                                          Workspace (M)
                                              |
                                              | (1)
                                              |
                                              v
                                          Note (M)
                                              |
                    +-------------------------+-------------------------+
                    |                         |                         |
                    v (M)                     v (M)                     v (M)
                NoteTag                     Vote                   NoteHistory
                    |                                                   |
                    v (M)                                               v (M)
                  Tag                                                 User
```

### Tables

1. **User** - Stores user authentication and profile
   - id, email, password, name, timestamps

2. **Company** - Multi-tenant companies
   - id, name, timestamps

3. **UserCompany** - Many-to-many relationship (user can belong to multiple companies)
   - id, userId, companyId, role (owner/admin/member)

4. **Workspace** - Organizational units within companies
   - id, name, companyId, timestamps

5. **Note** - Core entity storing notes
   - id, title, content, type (PUBLIC/PRIVATE), isDraft, workspaceId, publishedAt, timestamps
   - Indexes on: workspaceId, type+isDraft, title, createdAt, updatedAt

6. **Tag** - Reusable tags
   - id, name (unique), createdAt

7. **NoteTag** - Many-to-many relationship between notes and tags
   - id, noteId, tagId (unique together)

8. **Vote** - Upvotes/downvotes on notes
   - id, noteId, userId, ipAddress, voteType (UPVOTE/DOWNVOTE)
   - Unique constraint on noteId+userId and noteId+ipAddress

9. **NoteHistory** - Version history for notes
   - id, noteId, title, content, userId, createdAt
   - Indexed on noteId and createdAt for efficient queries

## 7-Day History Retention Strategy

### Implementation Approach

We use **PostgreSQL native features** to automatically delete old history entries without stressing the server:

#### Option 1: PostgreSQL Cron Extension (Recommended)

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily cleanup at 2 AM
SELECT cron.schedule(
  'delete-old-history',
  '0 2 * * *',
  $$DELETE FROM "NoteHistory" WHERE "createdAt" < NOW() - INTERVAL '7 days'$$
);
```

**Benefits:**
- Runs inside PostgreSQL, no application server needed
- Automatic execution even if app is down
- Minimal resource usage
- No external dependencies

#### Option 2: Database Trigger + Partition (Advanced)

```sql
-- Create partitioned table for automatic cleanup
CREATE TABLE "NoteHistory" (
  -- columns
) PARTITION BY RANGE ("createdAt");

-- Create partitions for each day
-- Old partitions can be dropped instantly
```

#### Option 3: Application-Level Cron (Fallback)

If database-level cron is not available:

1. **Use node-cron package** (lightweight, no Redis/worker needed)
2. **Run cleanup job daily at low-traffic hours**
3. **Delete in batches to avoid locks**

```typescript
// src/jobs/cleanup.ts
import cron from 'node-cron';
import prisma from './config/database';

// Run every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  await prisma.noteHistory.deleteMany({
    where: { createdAt: { lt: sevenDaysAgo } }
  });
  
  console.log('Old history cleaned up');
});
```

### Why This Approach?

1. **No Redis/Worker Queue** - Uses native PostgreSQL or simple node-cron
2. **Offloaded Processing** - Runs during low-traffic hours (2 AM)
3. **Efficient Deletion** - Batch deletes with indexed createdAt column
4. **Zero Downtime** - Non-blocking operation
5. **Automatic** - Set it and forget it

### Performance Considerations

- **Index on createdAt** - Makes deletion query fast (O(log n))
- **Batch Processing** - If millions of records, delete in chunks
- **Low-Traffic Window** - Scheduled at 2 AM to minimize impact
- **Vacuum** - PostgreSQL auto-vacuum reclaims space

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

3. **Run migrations:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Seed database:**
   ```bash
   npm run seed
   ```
   This creates:
   - 100 companies
   - 1,000 workspaces
   - 500,000 notes
   - Realistic tags and relationships

5. **Start server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Companies
- `POST /api/companies` - Create company (authenticated)
- `GET /api/companies` - List user's companies (authenticated)

### Workspaces
- `POST /api/workspaces` - Create workspace (authenticated)
- `GET /api/workspaces?companyId=xxx` - List workspaces (authenticated)

### Notes
- `POST /api/notes` - Create note (authenticated)
- `PUT /api/notes/:id` - Update note (authenticated, creates history)
- `DELETE /api/notes/:id` - Delete note (authenticated)
- `GET /api/notes/private?search=xxx&workspaceId=xxx` - List private notes (authenticated)
- `GET /api/notes/public?search=xxx&sort=new|old|upvotes|downvotes` - List public notes
- `GET /api/notes/:id` - Get single note

### Votes
- `POST /api/votes` - Vote on note (body: { noteId, voteType: 'UPVOTE'|'DOWNVOTE' })

### History
- `GET /api/history/:noteId` - Get note history (authenticated)
- `POST /api/history/restore/:historyId` - Restore from history (authenticated)

## Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - bcrypt with salt rounds
3. **Helmet.js** - Security headers
4. **Rate Limiting** - 100 requests per 15 minutes
5. **CORS** - Configured for frontend origin
6. **Input Validation** - Prisma type safety
7. **SQL Injection Protection** - Prisma ORM
8. **Access Control** - Company/workspace ownership checks

## Performance Optimizations

1. **Database Indexes** - On all foreign keys and search fields
2. **Batch Operations** - Seeder uses batch inserts
3. **Query Optimization** - Selective field loading
4. **Connection Pooling** - Prisma connection pool
5. **Efficient Sorting** - Database-level sorting for votes

## Scalability

- **Multi-tenant Architecture** - Company-based isolation
- **Indexed Queries** - Fast lookups even with millions of records
- **Stateless API** - Horizontal scaling ready
- **Database Partitioning Ready** - Can partition by company/date
- **CDN Ready** - Static assets can be offloaded
