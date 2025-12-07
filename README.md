# Production-Grade SaaS Notes System

A highly efficient, secure, multi-tenant workspace notes system built with React, TypeScript, Express, Prisma, and PostgreSQL.

## Features

✅ Multi-tenant architecture (users can belong to multiple companies)
✅ Company → Workspace → Notes hierarchy
✅ Public/Private notes with draft mode
✅ Full-text search by title
✅ Tag system for note organization
✅ Upvote/Downvote system for public notes
✅ 7-day note history with restore functionality
✅ JWT authentication (no OAuth/NextAuth)
✅ Production-ready security (Helmet, rate limiting, CORS)
✅ Optimized for 500K+ notes with proper indexing
✅ Seeder for 1,000 workspaces and 500,000 notes

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Redux Toolkit (state management)
- React Router (routing)
- Tailwind CSS (styling)
- Axios (API calls)

**Backend:**
- Express.js
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcryptjs (password hashing)
- Helmet (security headers)
- express-rate-limit (DDoS protection)

## Database Design

See [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) for detailed schema and ER diagram.

**Key Tables:**
- User, Company, UserCompany (multi-tenant)
- Workspace, Note, Tag, NoteTag
- Vote, NoteHistory

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone and Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Database Setup

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (creates 1,000 workspaces + 500,000 notes)
npm run seed
```

**Note:** Seeding takes 5-10 minutes. Progress is logged to console.

### 3. Start Development Servers

```bash
# Terminal 1 - Backend (port 3000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

### 4. Login

Default seeded user:
- Email: `admin@example.com`
- Password: `password123`

## 7-Day History Retention Strategy

### Automated Cleanup Implementation

We use **PostgreSQL pg_cron extension** for automatic history cleanup without stressing the application server.

#### Setup (PostgreSQL)

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily cleanup at 2 AM
SELECT cron.schedule(
  'delete-old-history',
  '0 2 * * *',
  $$DELETE FROM "NoteHistory" WHERE "createdAt" < NOW() - INTERVAL '7 days'$$
);

-- Verify scheduled job
SELECT * FROM cron.job;
```

#### Why This Approach?

1. **Offloaded Processing** - Runs inside PostgreSQL, not application server
2. **Automatic Execution** - Works even if app is down
3. **Efficient** - Uses indexed `createdAt` column for fast deletion
4. **Low-Traffic Window** - Scheduled at 2 AM to minimize impact
5. **No External Dependencies** - No Redis, no worker queues needed

#### Alternative: Application-Level Cron (Fallback)

If pg_cron is not available, use node-cron:

```typescript
// backend/src/jobs/cleanup.ts
import cron from 'node-cron';
import prisma from './config/database';

cron.schedule('0 2 * * *', async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const deleted = await prisma.noteHistory.deleteMany({
    where: { createdAt: { lt: sevenDaysAgo } }
  });
  
  console.log(`Deleted ${deleted.count} old history entries`);
});
```

Then import in `server.ts`:
```typescript
import './jobs/cleanup';
```

#### Performance Considerations

- **Indexed Query** - `createdAt` has index for O(log n) lookup
- **Batch Delete** - PostgreSQL handles efficiently
- **Auto Vacuum** - PostgreSQL reclaims disk space automatically
- **Non-Blocking** - Runs during low-traffic hours

## API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login (returns JWT token)
```

### Companies
```
POST /api/companies     - Create company
GET  /api/companies     - List user's companies
```

### Workspaces
```
POST /api/workspaces              - Create workspace
GET  /api/workspaces?companyId=x  - List workspaces
```

### Notes
```
POST   /api/notes                           - Create note
PUT    /api/notes/:id                       - Update note (creates history)
DELETE /api/notes/:id                       - Delete note
GET    /api/notes/private?search=x          - List private notes (authenticated)
GET    /api/notes/public?search=x&sort=new  - List public notes
GET    /api/notes/:id                       - Get single note
```

**Sort options:** `new`, `old`, `upvotes`, `downvotes`

### Votes
```
POST /api/votes - Vote on note
Body: { noteId: string, voteType: 'UPVOTE' | 'DOWNVOTE' }
```

### History
```
GET  /api/history/:noteId           - Get note history
POST /api/history/restore/:historyId - Restore from history
```

## Security Features

1. **JWT Authentication** - Secure token-based auth (7-day expiry)
2. **Password Hashing** - bcrypt with 10 salt rounds
3. **Helmet.js** - Security headers (XSS, clickjacking protection)
4. **Rate Limiting** - 100 requests per 15 minutes per IP
5. **CORS** - Configured for frontend origin only
6. **SQL Injection Protection** - Prisma ORM parameterized queries
7. **Access Control** - Company/workspace ownership validation
8. **Input Validation** - TypeScript + Prisma type safety

## Performance Optimizations

### Database
- **Indexes** on all foreign keys and search fields
- **Composite indexes** for common query patterns
- **Batch operations** in seeder (1,000 records per batch)
- **Connection pooling** via Prisma

### Application
- **Selective field loading** - Only fetch needed data
- **Database-level sorting** - Offload computation to PostgreSQL
- **Efficient vote counting** - Aggregated in single query

### Frontend
- **Code splitting** - React Router lazy loading ready
- **Optimized re-renders** - Redux selectors
- **Debounced search** - Can be added for better UX

## Scalability

### Current Capacity
- Handles 500,000+ notes efficiently
- Tested with 1,000 workspaces
- Sub-second query times with proper indexes

### Growth Strategy
1. **Horizontal Scaling** - Stateless API, add more servers
2. **Database Partitioning** - Partition by company or date range
3. **Read Replicas** - Separate read/write databases
4. **Caching Layer** - Add Redis for hot data (optional)
5. **CDN** - Offload static assets
6. **Microservices** - Split into auth, notes, history services

### Database Partitioning Example
```sql
-- Partition notes by company for better isolation
CREATE TABLE notes_partition_company_1 PARTITION OF notes
FOR VALUES IN ('company-1-uuid');
```

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.ts        # Prisma client
│   ├── middleware/
│   │   └── auth.ts            # JWT middleware
│   ├── modules/
│   │   ├── auth.routes.ts     # Auth endpoints
│   │   ├── company.routes.ts  # Company endpoints
│   │   ├── workspace.routes.ts
│   │   ├── note.routes.ts
│   │   ├── vote.routes.ts
│   │   └── history.routes.ts
│   ├── app.ts                 # Express app
│   ├── server.ts              # Server entry
│   └── seed.ts                # Database seeder
└── package.json

frontend/
├── src/
│   ├── components/
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── PrivateNotes.tsx   # My notes (search, edit, delete)
│   │   ├── PublicNotes.tsx    # Public directory (sort, vote)
│   │   ├── NoteForm.tsx       # Create/edit with draft mode
│   │   └── NoteHistory.tsx    # History view + restore
│   ├── store/
│   │   ├── index.ts           # Redux store
│   │   └── authSlice.ts       # Auth state
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── utils/
│   │   └── api.ts             # Axios client
│   ├── App.tsx                # Routes
│   └── main.tsx               # Entry point
└── package.json
```

## Testing the System

### 1. Create Company & Workspace
```bash
# Login first, then:
curl -X POST http://localhost:3000/api/companies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Company"}'

curl -X POST http://localhost:3000/api/workspaces \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Workspace", "companyId": "COMPANY_ID"}'
```

### 2. Create Note
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Note",
    "content": "This is a test",
    "type": "PUBLIC",
    "isDraft": false,
    "workspaceId": "WORKSPACE_ID",
    "tags": ["test", "demo"]
  }'
```

### 3. Search Public Notes
```bash
curl http://localhost:3000/api/notes/public?search=test&sort=new
```

## Production Deployment

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secret-key-min-32-chars
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.com
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-api.com/api
```

### Build Commands

```bash
# Backend
cd backend
npm run build
node dist/server.js

# Frontend
cd frontend
npm run build
# Deploy dist/ folder to CDN/static hosting
```

### Recommended Hosting
- **Backend**: AWS EC2, DigitalOcean, Railway, Render
- **Database**: AWS RDS, DigitalOcean Managed PostgreSQL
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **CDN**: Cloudflare, AWS CloudFront

## Monitoring & Maintenance

### Database Maintenance
```sql
-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables WHERE schemaname = 'public';

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM "Note" WHERE type='PUBLIC' AND "isDraft"=false;

-- Manual vacuum (if needed)
VACUUM ANALYZE "NoteHistory";
```

### Application Monitoring
- Add logging (Winston, Pino)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- Uptime monitoring (UptimeRobot)

## Troubleshooting

### Seeder is slow
- Normal for 500K records (5-10 minutes)
- Increase `BATCH_SIZE` in seed.ts for faster insertion
- Disable indexes temporarily during seeding

### History not deleting
- Check pg_cron is installed: `SELECT * FROM pg_available_extensions WHERE name='pg_cron';`
- Verify cron job: `SELECT * FROM cron.job;`
- Check logs: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;`

### Slow queries
- Run `EXPLAIN ANALYZE` on slow queries
- Check indexes: `SELECT * FROM pg_indexes WHERE tablename = 'Note';`
- Consider adding composite indexes

## License

MIT

## Support

For issues or questions, check:
- Database design: [DATABASE_DESIGN.md](./DATABASE_DESIGN.md)
- Backend README: [backend/README.md](./backend/README.md)
