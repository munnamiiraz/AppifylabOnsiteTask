import React, { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  workspace: string;
  workspaceId: number;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  createdAt: string;
  updatedAt: string;
  author: string;
}

type SortOption = 'new' | 'old' | 'most_upvotes' | 'most_downvotes';

const PublicNotesDirectory: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('new');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const notesPerPage = 20;

  // Dummy data for demonstration
  const dummyNotes: Note[] = [
    {
      id: 1,
      title: 'Getting Started with React Hooks',
      workspace: 'Engineering',
      workspaceId: 101,
      tags: ['react', 'hooks', 'javascript'],
      upvotes: 245,
      downvotes: 12,
      userVote: null,
      createdAt: '2024-03-15T10:30:00Z',
      updatedAt: '2024-03-15T10:30:00Z',
      author: 'John Doe'
    },
    {
      id: 2,
      title: 'Product Roadmap 2024',
      workspace: 'Product',
      workspaceId: 102,
      tags: ['roadmap', 'planning', 'strategy'],
      upvotes: 189,
      downvotes: 8,
      userVote: 'up',
      createdAt: '2024-03-14T09:15:00Z',
      updatedAt: '2024-03-14T14:20:00Z',
      author: 'Jane Smith'
    },
    {
      id: 3,
      title: 'API Design Best Practices',
      workspace: 'Engineering',
      workspaceId: 101,
      tags: ['api', 'design', 'rest', 'backend'],
      upvotes: 312,
      downvotes: 23,
      userVote: null,
      createdAt: '2024-03-13T14:45:00Z',
      updatedAt: '2024-03-13T14:45:00Z',
      author: 'Mike Johnson'
    },
    {
      id: 4,
      title: 'Marketing Campaign Q1 Results',
      workspace: 'Marketing',
      workspaceId: 103,
      tags: ['campaign', 'analytics', 'results'],
      upvotes: 156,
      downvotes: 34,
      userVote: 'down',
      createdAt: '2024-03-12T11:20:00Z',
      updatedAt: '2024-03-12T16:30:00Z',
      author: 'Sarah Williams'
    },
    {
      id: 5,
      title: 'Database Optimization Techniques',
      workspace: 'Engineering',
      workspaceId: 101,
      tags: ['database', 'optimization', 'performance'],
      upvotes: 428,
      downvotes: 19,
      userVote: null,
      createdAt: '2024-03-11T08:00:00Z',
      updatedAt: '2024-03-11T08:00:00Z',
      author: 'David Brown'
    },
    {
      id: 6,
      title: 'User Research Insights - Mobile App',
      workspace: 'Product',
      workspaceId: 102,
      tags: ['research', 'ux', 'mobile'],
      upvotes: 203,
      downvotes: 15,
      userVote: null,
      createdAt: '2024-03-10T13:30:00Z',
      updatedAt: '2024-03-10T13:30:00Z',
      author: 'Emily Davis'
    },
    {
      id: 7,
      title: 'Cloud Infrastructure Setup Guide',
      workspace: 'Engineering',
      workspaceId: 101,
      tags: ['cloud', 'infrastructure', 'devops', 'aws'],
      upvotes: 367,
      downvotes: 28,
      userVote: 'up',
      createdAt: '2024-03-09T10:15:00Z',
      updatedAt: '2024-03-09T15:45:00Z',
      author: 'Chris Wilson'
    },
    {
      id: 8,
      title: 'Content Strategy 2024',
      workspace: 'Marketing',
      workspaceId: 103,
      tags: ['content', 'strategy', 'social-media'],
      upvotes: 134,
      downvotes: 42,
      userVote: null,
      createdAt: '2024-03-08T09:00:00Z',
      updatedAt: '2024-03-08T09:00:00Z',
      author: 'Amanda Taylor'
    }
  ];

  useEffect(() => {
    fetchNotes();
  }, [sortBy]);

  const fetchNotes = async (): Promise<void> => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch(`/api/notes/public?sort=${sortBy}`);
      // const data = await response.json();
      // setNotes(data.notes);
      
      setTimeout(() => {
        setNotes(dummyNotes);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setLoading(false);
    }
  };

  const handleVote = async (noteId: number, voteType: 'up' | 'down'): Promise<void> => {
    try {
      // Replace with actual API call
      // await fetch(`/api/notes/${noteId}/vote`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ voteType })
      // });

      setNotes(notes.map(note => {
        if (note.id === noteId) {
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

          return {
            ...note,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote
          };
        }
        return note;
      }));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const sortNotes = (notesToSort: Note[]): Note[] => {
    const sorted = [...notesToSort];
    switch (sortBy) {
      case 'new':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'old':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'most_upvotes':
        return sorted.sort((a, b) => b.upvotes - a.upvotes);
      case 'most_downvotes':
        return sorted.sort((a, b) => b.downvotes - a.downvotes);
      default:
        return sorted;
    }
  };

  const filteredNotes = sortNotes(
    notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
            <div className="flex items-center space-x-1">
              <button
                onClick={() => window.location.href = '/workspaces'}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                My Workspaces
              </button>
              <button
                onClick={() => window.location.href = '/public'}
                className="text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Public Notes
              </button>
              <button
                onClick={() => window.location.href = '/notes/create'}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-4"
              >
                + New Note
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Public Notes Directory</h1>
          <p className="text-gray-600">Explore and discover notes shared by the community</p>
        </div>

        {/* Search and Sort Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search notes by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="new">Newest First</option>
                <option value="old">Oldest First</option>
                <option value="most_upvotes">Most Upvotes</option>
                <option value="most_downvotes">Most Downvotes</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Found {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={fetchNotes}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Notes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading notes...</p>
          </div>
        ) : currentNotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentNotes.map(note => (
                <div key={note.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center mr-6 space-y-2">
                      <button
                        onClick={() => handleVote(note.id, 'up')}
                        className={`p-1 rounded transition-colors ${
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
                        onClick={() => handleVote(note.id, 'down')}
                        className={`p-1 rounded transition-colors ${
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

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 
                          onClick={() => window.location.href = `/notes/${note.id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mb-2"
                        >
                          {note.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            {note.workspace}
                          </span>
                          <span>•</span>
                          <span>by {note.author}</span>
                          <span>•</span>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default PublicNotesDirectory;