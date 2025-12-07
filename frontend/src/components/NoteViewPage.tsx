import React, { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  workspace: string;
  workspaceId: number;
  author: string;
  authorId: number;
  tags: string[];
  isPublic: boolean;
  isDraft: boolean;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  createdAt: string;
  updatedAt: string;
  views: number;
}

interface Props {
  noteId: string;
}

const NoteViewPage: React.FC<Props> = ({ noteId }) => {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Dummy data
  const dummyNote: Note = {
    id: 1,
    title: 'API Design Best Practices',
    content: `# API Design Best Practices

## Introduction
This document outlines the key principles and best practices for designing robust, scalable, and maintainable APIs.

## Core Principles

### 1. RESTful Design
- Use proper HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Design resource-oriented endpoints
- Use meaningful URL structures

### 2. Versioning
- Always version your API (e.g., /api/v1/resources)
- Maintain backward compatibility when possible
- Clearly communicate breaking changes

### 3. Error Handling
- Return appropriate HTTP status codes
- Provide clear, actionable error messages
- Include error codes for programmatic handling

### 4. Security
- Implement proper authentication (OAuth 2.0, JWT)
- Use HTTPS for all endpoints
- Validate and sanitize all inputs
- Rate limiting to prevent abuse

### 5. Documentation
- Maintain up-to-date API documentation
- Provide code examples in multiple languages
- Document all endpoints, parameters, and responses

## Example Code

\`\`\`javascript
// Example: RESTful endpoint structure
app.get('/api/v1/users/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});
\`\`\`

## Best Practices Summary
1. Keep it simple and intuitive
2. Be consistent across all endpoints
3. Think about scalability from the start
4. Monitor and log API usage
5. Plan for rate limiting early

## Conclusion
Following these best practices will help you build APIs that are reliable, maintainable, and developer-friendly.`,
    workspace: 'Engineering',
    workspaceId: 101,
    author: 'John Doe',
    authorId: 1,
    tags: ['api', 'design', 'rest', 'backend'],
    isPublic: true,
    isDraft: false,
    upvotes: 312,
    downvotes: 23,
    userVote: null,
    createdAt: '2024-03-13T14:45:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
    views: 1547
  };

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  const fetchNote = async (): Promise<void> => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch(`/api/notes/${noteId}`);
      // const data = await response.json();
      // setNote(data.note);
      // setIsOwner(data.isOwner);
      
      setTimeout(() => {
        setNote(dummyNote);
        setIsOwner(true); // Simulate ownership
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching note:', error);
      setLoading(false);
    }
  };

  const handleVote = async (voteType: 'up' | 'down'): Promise<void> => {
    if (!note) return;
    
    try {
      // Replace with actual API call
      // await fetch(`/api/notes/${noteId}/vote`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ voteType })
      // });

      const wasUpvoted = note.userVote === 'up';
      const wasDownvoted = note.userVote === 'down';
      
      let newUpvotes = note.upvotes;
      let newDownvotes = note.downvotes;
      let newUserVote: 'up' | 'down' | null = voteType;

      if (voteType === 'up') {
        if (wasUpvoted) {
          newUpvotes--;
          newUserVote = null;
        } else {
          newUpvotes++;
          if (wasDownvoted) newDownvotes--;
        }
      } else {
        if (wasDownvoted) {
          newDownvotes--;
          newUserVote = null;
        } else {
          newDownvotes++;
          if (wasUpvoted) newUpvotes--;
        }
      }

      setNote({
        ...note,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: newUserVote
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      // Replace with actual API call
      // await fetch(`/api/notes/${noteId}`, {
      //   method: 'DELETE'
      // });
      
      setTimeout(() => {
        alert('Note deleted successfully');
        window.location.href = '/workspaces';
      }, 500);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Note not found</h2>
          <button
            onClick={() => window.location.href = '/workspaces'}
            className="text-blue-600 hover:text-blue-700"
          >
            Return to workspaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">Workspace Notes</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/workspaces'}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                My Workspaces
              </button>
              <button
                onClick={() => window.location.href = '/public'}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Public Notes
              </button>
              {isOwner && (
                <>
                  <button
                    onClick={() => window.location.href = `/notes/${noteId}/edit`}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => window.location.href = `/notes/${noteId}/history`}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    History
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  {note.isDraft && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Draft
                    </span>
                  )}
                  {note.isPublic ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Public
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      Private
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {note.author}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {note.workspace}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {note.views} views
                  </span>
                  <span>Created {formatDate(note.createdAt)}</span>
                  {note.updatedAt !== note.createdAt && (
                    <span>Updated {formatDate(note.updatedAt)}</span>
                  )}
                </div>
              </div>

              {/* Vote buttons for public notes */}
              {note.isPublic && (
                <div className="flex flex-col items-center ml-6 space-y-2">
                  <button
                    onClick={() => handleVote('up')}
                    className={`p-2 rounded transition-colors ${
                      note.userVote === 'up'
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold text-gray-900">
                    {note.upvotes - note.downvotes}
                  </span>
                  <button
                    onClick={() => handleVote('down')}
                    className={`p-2 rounded transition-colors ${
                      note.userVote === 'down'
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {isOwner && (
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => window.location.href = `/notes/${noteId}/edit`}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => window.location.href = `/notes/${noteId}/history`}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>View History</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                {note.content}
              </pre>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Note</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{note.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteViewPage;