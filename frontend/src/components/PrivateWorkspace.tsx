import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { Note, Workspace } from '../types';

const PrivateWorkspace: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'draft' | 'public' | 'private'>('all');
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workspaceId = searchParams.get('workspaceId');

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, workspaceId, filterType, page]);

  const filteredNotes = notes.filter(note => {
    if (filterType === 'draft') return note.isDraft;
    if (filterType === 'public') return note.type === 'PUBLIC' && !note.isDraft;
    if (filterType === 'private') return note.type === 'PRIVATE' && !note.isDraft;
    return true;
  });

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (workspaceId) params.append('workspaceId', workspaceId);
      params.append('page', page.toString());
      params.append('limit', '15');
      
      const { data } = await api.get(`/notes/private?${params.toString()}`);
      setNotes(data.data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter(note => note.id !== noteId));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            {workspaceId && (
              <button
                onClick={() => navigate('/workspaces')}
                className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Workspaces</span>
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {workspaceId ? 'Workspace Notes' : 'My Notes'}
          </h1>
          <p className="text-gray-600">
            {workspaceId ? 'Notes in this workspace' : 'All your private notes'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative md:col-span-2">
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
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">All Notes</option>
              <option value="draft">Drafts Only</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Page {page} - Showing {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}</p>
            <button onClick={fetchNotes} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Refresh</button>
          </div>
        </div>

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
            <p className="text-gray-600 mb-6">{searchQuery ? 'Try adjusting your search query' : 'Create your first note to get started'}</p>
            <button onClick={() => navigate('/notes/new')} className="inline-flex items-center bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
              Create New Note
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <div key={note.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 
                      onClick={() => navigate(`/notes/${note.id}`)}
                      className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer"
                    >
                      {note.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {note.isDraft && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Draft</span>}
                      {!note.isDraft && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Published</span>}
                      <span>{note.workspace?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map(({ tag }) => (
                      <span key={tag.id} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex space-x-2">
                  <button onClick={() => navigate(`/notes/edit/${note.id}`)} className="flex items-center space-x-1 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium">
                    <span>Edit</span>
                  </button>
                  <button onClick={() => navigate(`/notes/history/${note.id}`)} className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium">
                    <span>History</span>
                  </button>
                  <button onClick={() => { setNoteToDelete(note); setShowDeleteModal(true); }} className="flex items-center space-x-1 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium">
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredNotes.length > 0 && (
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={notes.length < 15}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {showDeleteModal && noteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Note</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{noteToDelete.title}"? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button onClick={() => { setShowDeleteModal(false); setNoteToDelete(null); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(noteToDelete.id)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
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
