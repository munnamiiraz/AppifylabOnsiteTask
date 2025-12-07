# Database Design - SaaS Notes System

## Entity Relationship Diagram

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ email (unique)  │
│ password        │
│ name            │
│ createdAt       │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│  UserCompany    │  (Junction Table)
├─────────────────┤
│ id (PK)         │
│ userId (FK)     │───────┐
│ companyId (FK)  │       │
│ createdAt       │       │
└─────────────────┘       │
                          │
         ┌────────────────┘
         │
         │ N:1
         │
┌────────▼────────┐
│    Company      │
├─────────────────┤
│ id (PK)         │
│ name            │
│ createdAt       │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│   Workspace     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ companyId (FK)  │
│ createdAt       │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│      Note       │
├─────────────────┤
│ id (PK)         │
│ title           │
│ content         │
│ type            │ (PUBLIC/PRIVATE)
│ isDraft         │
│ workspaceId(FK) │
│ publishedAt     │
│ createdAt       │
│ updatedAt       │
└────┬────┬───────┘
     │    │
     │    │ 1:N
     │    │
     │    ├──────────────┐
     │    │              │
     │    │         ┌────▼────────┐
     │    │         │    Vote     │
     │    │         ├─────────────┤
     │    │         │ id (PK)     │
     │    │         │ noteId (FK) │
     │    │         │ userId (FK) │
     │    │         │ ipAddress   │
     │    │         │ voteType    │ (UPVOTE/DOWNVOTE)
     │    │         │ createdAt   │
     │    │         └─────────────┘
     │    │
     │    │ 1:N
     │    │
     │    └──────────────┐
     │                   │
     │              ┌────▼────────────┐
     │              │  NoteHistory    │
     │              ├─────────────────┤
     │              │ id (PK)         │
     │              │ noteId (FK)     │
     │              │ title           │
     │              │ content         │
     │              │ userId (FK)     │
     │              │ createdAt       │
     │              └─────────────────┘
     │
     │ N:M (via NoteTag)
     │
     ├──────────────┐
     │              │
┌────▼────────┐ ┌──▼──────────┐
│   NoteTag   │ │     Tag     │
├─────────────┤ ├─────────────┤
│ id (PK)     │ │ id (PK)     │
│ noteId (FK) │ │ name(unique)│
│ tagId (FK)  │ │ createdAt   │
└─────────────┘ └─────────────┘
```

## Table Descriptions

### User
Stores user authentication and profile information.
- **Primary Key**: `id` (UUID)
- **Unique Constraint**: `email`
- **Indexes**: `email`

### Company
Represents a company/organization in the multi-tenant system.
- **Primary Key**: `id` (UUID)
- **Relationships**: Has many Users (via UserCompany), Has many Workspaces

### UserCompany (Junction Table)
Links users to companies (many-to-many relationship).
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `userId`, `companyId`
- **Unique Constraint**: `(userId, companyId)`
- **Purpose**: Allows users to belong to multiple companies

### Workspace
Organizational unit within a company for grouping notes.
- **Primary Key**: `id` (UUID)
- **Foreign Key**: `companyId`
- **Indexes**: `companyId`
- **Relationships**: Belongs to Company, Has many Notes

### Note
Core entity storing note content and metadata.
- **Primary Key**: `id` (UUID)
- **Foreign Key**: `workspaceId`
- **Indexes**: 
  - `workspaceId`
  - `type`
  - `isDraft`
  - `title` (for search)
  - `createdAt`, `updatedAt`
- **Enums**: 
  - `type`: PUBLIC, PRIVATE
- **Relationships**: 
  - Belongs to Workspace
  - Has many Tags (via NoteTag)
  - Has many Votes
  - Has many History entries

### Tag
Reusable labels for categorizing notes.
- **Primary Key**: `id` (UUID)
- **Unique Constraint**: `name`
- **Relationships**: Has many Notes (via NoteTag)

### NoteTag (Junction Table)
Links notes to tags (many-to-many relationship).
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `noteId`, `tagId`
- **Unique Constraint**: `(noteId, tagId)`
- **Indexes**: `noteId`, `tagId`

### Vote
Stores upvotes/downvotes for public notes.
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `noteId`, `userId` (optional)
- **Unique Constraint**: `(noteId, userId)` OR `(noteId, ipAddress)`
- **Enums**: `voteType`: UPVOTE, DOWNVOTE
- **Indexes**: `noteId`
- **Purpose**: Allows one vote per user/IP per note

### NoteHistory
Stores historical versions of notes (7-day retention).
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `noteId`, `userId`
- **Indexes**: 
  - `noteId`
  - `createdAt` (for cleanup queries)
- **Retention**: Automatically deleted after 7 days via pg_cron

## Key Design Decisions

### 1. Multi-Tenancy
- **Pattern**: Shared database with tenant isolation via `companyId`
- **Benefits**: Cost-effective, easier maintenance
- **Security**: All queries filtered by company ownership

### 2. Many-to-Many Relationships
- **UserCompany**: Users can belong to multiple companies
- **NoteTag**: Notes can have multiple tags, tags can be on multiple notes
- **Implementation**: Explicit junction tables with composite unique constraints

### 3. Voting System
- **Constraint**: One vote per user/IP per note
- **Implementation**: Unique constraint on `(noteId, userId)` or `(noteId, ipAddress)`
- **Guest Support**: Uses IP address for non-authenticated users

### 4. History Retention
- **Strategy**: Automatic cleanup via PostgreSQL pg_cron
- **Retention**: 7 days
- **Performance**: Indexed `createdAt` for efficient deletion
- **Offloading**: Runs in database, not application server

### 5. Performance Optimizations
- **Indexes**: All foreign keys, search fields, and sort fields
- **Composite Indexes**: Common query patterns (e.g., `type + isDraft`)
- **Selective Loading**: Only fetch required fields
- **Batch Operations**: Seeder uses batch inserts (1,000 records/batch)

## Scalability Considerations

### Current Capacity
- ✅ 500,000+ notes
- ✅ 1,000+ workspaces
- ✅ Sub-second query times

### Growth Strategy
1. **Horizontal Scaling**: Stateless API, add more servers
2. **Database Partitioning**: Partition by `companyId` or date
3. **Read Replicas**: Separate read/write databases
4. **Caching**: Redis for hot data (workspace lists, user sessions)
5. **Archiving**: Move old notes to cold storage

### Example Partitioning
```sql
-- Partition notes by company
CREATE TABLE notes_company_1 PARTITION OF notes
FOR VALUES IN ('company-1-uuid');

-- Partition history by date
CREATE TABLE note_history_2024_01 PARTITION OF note_history
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## Security Features

### 1. Access Control
- All queries filtered by company ownership
- Workspace access validated via company membership
- Private notes only visible to company members

### 2. Data Isolation
- Multi-tenant isolation via `companyId`
- No cross-company data leakage
- Workspace-level permissions

### 3. SQL Injection Prevention
- Prisma ORM with parameterized queries
- Type-safe query building
- No raw SQL in application code

## Query Patterns

### Most Common Queries
1. **List Private Notes**: `WHERE workspace.company.users.userId = ? AND type = PRIVATE`
2. **List Public Notes**: `WHERE type = PUBLIC AND isDraft = false ORDER BY createdAt DESC`
3. **Search Notes**: `WHERE title ILIKE ? AND ...`
4. **Vote Count**: `SELECT COUNT(*) FROM votes WHERE noteId = ? AND voteType = ?`
5. **History Cleanup**: `DELETE FROM note_history WHERE createdAt < NOW() - INTERVAL '7 days'`

### Optimized Indexes
```sql
-- Composite index for public notes listing
CREATE INDEX idx_notes_public ON notes(type, isDraft, createdAt DESC);

-- Search index
CREATE INDEX idx_notes_title_search ON notes USING gin(to_tsvector('english', title));

-- History cleanup index
CREATE INDEX idx_history_cleanup ON note_history(createdAt);

-- Vote aggregation index
CREATE INDEX idx_votes_note_type ON votes(noteId, voteType);
```

## Monitoring Queries

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## Backup Strategy

### Daily Backups
```bash
# Full database backup
pg_dump -h localhost -U postgres -d notes_db > backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump -h localhost -U postgres -d notes_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Point-in-Time Recovery
- Enable WAL archiving
- Retain 30 days of WAL files
- Test restore procedures monthly

## Migration Strategy

### Schema Changes
1. Create migration: `npx prisma migrate dev --name description`
2. Review generated SQL
3. Test on staging
4. Deploy to production during low-traffic window
5. Monitor performance post-deployment

### Data Migrations
- Use batch processing for large updates
- Run during maintenance windows
- Implement rollback procedures
- Monitor database load
