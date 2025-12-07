# Database Design - SaaS Notes System

## Visual Database Schema

```
┌─────────────┐
│    User     │
│─────────────│
│ id (PK)     │
│ email       │◄─────────┐
│ password    │          │
│ name        │          │
└─────────────┘          │
       │                 │
       │ 1               │ M
       │                 │
       ▼ M               │
┌─────────────┐          │
│ UserCompany │          │
│─────────────│          │
│ id (PK)     │          │
│ userId (FK) │──────────┘
│ companyId   │──────┐
│ role        │      │
└─────────────┘      │
       │ M           │
       │             │ 1
       ▼             ▼
┌─────────────┐
│   Company   │
│─────────────│
│ id (PK)     │
│ name        │
└─────────────┘
       │ 1
       │
       ▼ M
┌─────────────┐
│  Workspace  │
│─────────────│
│ id (PK)     │
│ name        │
│ companyId   │
└─────────────┘
       │ 1
       │
       ▼ M
┌─────────────┐
│    Note     │
│─────────────│
│ id (PK)     │
│ title       │
│ content     │
│ type        │ (PUBLIC/PRIVATE)
│ isDraft     │
│ workspaceId │
│ publishedAt │
└─────────────┘
   │    │    │
   │    │    └──────────┐
   │    │               │
   │ 1  │ 1             │ 1
   │    │               │
   ▼ M  ▼ M             ▼ M
┌──────┐ ┌──────┐  ┌──────────┐
│NoteTag│ │ Vote │  │NoteHistory│
└──────┘ └──────┘  └──────────┘
   │ M      │           │
   │        │           │
   ▼ 1     │           ▼ M
┌──────┐   │        ┌──────┐
│ Tag  │   │        │ User │
└──────┘   │        └──────┘
           │
           └─ userId/ipAddress
```

## Key Design Decisions

### 1. Multi-Tenancy (User → Company Relationship)
- **UserCompany** junction table allows one user to belong to multiple companies
- Each company is isolated with its own workspaces and notes
- Role-based access control (owner, admin, member)

### 2. Hierarchical Structure
```
Company → Workspace → Note
```
- Clean separation of concerns
- Easy to scale and manage permissions
- Workspace provides organizational grouping

### 3. Note Features
- **type**: PUBLIC (visible in directory) or PRIVATE (owner only)
- **isDraft**: Draft mode for incomplete work
- **publishedAt**: Tracks when note became public

### 4. Tagging System
- **Tag** table stores unique tags
- **NoteTag** junction table for many-to-many relationship
- Reusable tags across all notes

### 5. Voting System
- **Vote** table with UPVOTE/DOWNVOTE enum
- Unique constraint on (noteId + userId) OR (noteId + ipAddress)
- Prevents duplicate votes from same user/IP

### 6. History System (7-Day Retention)
- **NoteHistory** stores previous versions
- Automatically created on every note update
- Indexed on `createdAt` for efficient cleanup
- Stores userId to track who made changes

## Performance Optimizations

### Indexes
```prisma
// Fast lookups
@@index([email])           // User login
@@index([companyId])       // Company queries
@@index([workspaceId])     // Workspace notes
@@index([type, isDraft])   // Public note filtering
@@index([title])           // Search by title
@@index([createdAt])       // Sorting by date
@@index([noteId])          // History/votes lookup
```

### Unique Constraints
```prisma
@@unique([userId, companyId])  // One role per user per company
@@unique([noteId, tagId])      // No duplicate tags
@@unique([noteId, userId])     // One vote per user per note
```

## Scalability Features

1. **Indexed Foreign Keys** - All FK columns have indexes
2. **Composite Indexes** - Multi-column indexes for common queries
3. **Cascade Deletes** - Automatic cleanup of related records
4. **Partition Ready** - Can partition by company or date range
5. **Connection Pooling** - Prisma handles connection management

## Security

1. **Cascade Deletes** - No orphaned records
2. **Access Control** - Company membership checked on all operations
3. **Type Safety** - Prisma ensures data integrity
4. **Enum Types** - Prevents invalid values (NoteType, VoteType)

## Query Patterns

### Most Common Queries (Optimized)
```sql
-- Get user's notes (indexed: workspaceId, userId via company)
SELECT * FROM Note WHERE workspaceId IN (user's workspaces)

-- Public notes directory (indexed: type, isDraft, createdAt)
SELECT * FROM Note WHERE type='PUBLIC' AND isDraft=false ORDER BY createdAt

-- Search notes (indexed: title)
SELECT * FROM Note WHERE title ILIKE '%search%'

-- Note history (indexed: noteId, createdAt)
SELECT * FROM NoteHistory WHERE noteId=? ORDER BY createdAt DESC

-- Delete old history (indexed: createdAt)
DELETE FROM NoteHistory WHERE createdAt < NOW() - INTERVAL '7 days'
```

## Database Size Estimation

With 500,000 notes:
- **Note**: ~500K rows × 1KB = 500MB
- **NoteHistory**: ~2M rows × 1KB = 2GB (assuming 4 edits per note)
- **NoteTag**: ~1M rows × 50B = 50MB
- **Vote**: ~500K rows × 100B = 50MB
- **Total**: ~3GB (manageable for PostgreSQL)

## Diagram Link

You can visualize this schema using:
- **Prisma Studio**: `npm run prisma:studio` (interactive GUI)
- **dbdiagram.io**: Copy schema to create visual diagram
- **DBeaver/pgAdmin**: Connect to database for ER diagram

This design handles millions of records efficiently with proper indexing and partitioning strategies.
