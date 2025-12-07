import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Note } from '../types';

type SortOption = 'new' | 'old' | 'upvotes' | 'downvotes';

const PublicNotesDirectory: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('new');
  const [loading, setLoading] = useState(false);
  const [votingNoteId, setVotingNoteId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, [sortBy, searchQuery]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (sortBy) params.append('sort', sortBy);
      
      const { data } = await api.get(`/notes/public?${params.toString()}`);
      setNotes(data.data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (noteId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    if (votingNoteId) return;
    setVotingNoteId(noteId);
    try {
      const { data } = await api.post('/votes', { noteId, voteType });
      const { upvotes, downvotes } = data.data;
      
      setNotes(notes.map(note => 
        note.id === noteId 
          ? { ...note, upvotes, downvotes }
          : note
      ));
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVotingNoteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Public Notes Directory</h1>
          <p className="text-gray-600">Explore and discover notes shared by the community</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="new">Newest First</option>
                <option value="old">Oldest First</option>
                <option value="upvotes">Most Upvotes</option>
                <option value="downvotes">Most Downvotes</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Found {notes.length} note{notes.length !== 1 ? 's' : ''}</p>
            <button onClick={fetchNotes} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Refresh</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex">
                  <div className="flex flex-col items-center mr-6 space-y-2">
                    <button
                      onClick={() => handleVote(note.id, 'UPVOTE')}
                      disabled={votingNoteId === note.id}
                      className="p-1 rounded transition-colors text-gray-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {votingNoteId === note.id ? (
                        <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-green-600"></div>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <span className="text-lg font-semibold text-gray-900">
                      {(note.upvotes || 0) - (note.downvotes || 0)}
                    </span>
                    <button
                      onClick={() => handleVote(note.id, 'DOWNVOTE')}
                      disabled={votingNoteId === note.id}
                      className="p-1 rounded transition-colors text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {votingNoteId === note.id ? (
                        <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 
                        onClick={() => navigate(`/notes/${note.id}`)}
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mb-2"
                      >
                        {note.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          {note.workspace?.name || 'Unknown'}
                        </span>
                        <span>•</span>
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                    </div>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map(({ tag }) => (
                          <span key={tag.id} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicNotesDirectory;
