import React, { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  workspace: string;
  tags: string[];
  status: 'draft' | 'published';
  updatedAt: string;
  views: number;
}

interface Workspace {
  id: string;
  name: string;
}

const PrivateWorkspace: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const workspaces: Workspace[] = [
    { id: 'all', name: 'All Workspaces' },
    { id: 'Product', name: 'Product' },
    { id: 'Engineering', name: 'Engineering' },
    { id: 'Marketing', name: 'Marketing' },
    { id: 'General', name: 'General' },
  ];

  const dummyNotes: Note[] = [
    {
      id: 1,
      title: 'Project Roadmap Q1 2024',
      workspace: 'Product',
      tags: ['planning', 'roadmap'],
      status: 'published',
      updatedAt: '2024-03-15',
      views: 145
    },
    {
      id: 2,
      title: 'Team Meeting Notes - March',
      workspace: 'General',
      tags: ['meeting', 'team'],
      status: 'draft',
      updatedAt: '2024-03-14',
      views: 23
    },
    {
      id: 3,
      title: 'API Documentation v2.0',
      workspace: 'Engineering',
      tags: ['api', 'docs', 'technical'],
      status: 'published',
      updatedAt: '2024-03-13',
      views: 289
    },
    {
      id: 4,
      title: 'Marketing Campaign Ideas',
      workspace: 'Marketing',
      tags: ['campaign', 'ideas'],
      status: 'published',
      updatedAt: '2024-03-12',
      views: 67
    },
    {
      id: 5,
      title: 'Sprint Planning Notes',
      workspace: 'Engineering',
      tags: ['sprint', 'planning'],
      status: 'draft',
      updatedAt: '2024-03-11',
      views: 12
    },
    {
      id: 6,
      title: 'User Research Findings',
      workspace: 'Product',
      tags: ['research', 'users'],
      status: 'published',
      updatedAt: '2024-03-10',
      views: 198
    },
    {
      id: 7,
      title: 'Q4 Budget Review',
      workspace: 'General',
      tags: ['budget', 'finance'],
      status: 'published',
      updatedAt: '2024-03-09',
      views: 54
    },
    {
      id: 8,
      title: 'Feature Specifications',
      workspace: 'Product',
      tags: ['specs', 'features'],
      status: 'draft',
      updatedAt: '2024-03-08',
      views: 89
    },
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async (): Promise<void> => {
    setLoading(true);
    try {
      setTimeout(() => {
        setNotes(dummyNotes);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: number): Promise<void> => {
    try {
      setNotes(notes.filter(note => note.id !== noteId));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWorkspace = selectedWorkspace === 'all' || note.workspace === selectedWorkspace;
    return matchesSearch && matchesWorkspace;
  });

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
                className="text-blue-600 px-3 py-2 text-sm font-medium"
              >
                My Workspaces
              </button>
              <button
                onClick={() => window.location.href = '/public'}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Public Notes
              </button>
              <button
                onClick={() => window.location.href = '/drafts'}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Drafts
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Workspaces</h1>
          <p className="text-gray-600">Manage your private notes and workspaces</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Workspace Filter */}
            <div>
              <select
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
              >
                {workspaces.map(workspace => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
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
        ) : filteredNotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search query' : 'Create your first note to get started'}
            </p>
            <button
              onClick={() => window.location.href = '/notes/create'}
              className="inline-flex items-center bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create New Note
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <div key={note.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {note.status === 'draft' && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          Draft
                        </span>
                      )}
                      {note.status === 'published' && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          Published
                        </span>
                      )}
                      <span>{note.workspace}</span>
                      <span>•</span>
                      <span>{note.updatedAt}</span>
                      <span>•</span>
                      <span>{note.views} views</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => window.location.href = `/notes/${note.id}`}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => window.location.href = `/notes/${note.id}/edit`}
                    className="flex items-center space-x-1 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setNoteToDelete(note);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center space-x-1 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && noteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Note</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{noteToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setNoteToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(noteToDelete.id)}
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

export default PrivateWorkspace;