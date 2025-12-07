import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Note } from '../types';

export default function NoteView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/notes/${id}`);
      setNote(data.data);
    } catch (error) {
      console.error('Error fetching note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
    if (!note || votingLoading) return;
    setVotingLoading(true);
    try {
      const { data } = await api.post('/votes', { noteId: note.id, voteType });
      setNote({ ...note, upvotes: data.data.upvotes, downvotes: data.data.downvotes });
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVotingLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Note not found</h2>
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            <div className="flex items-start space-x-6 mb-6">
              {note.type === 'PUBLIC' && (
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => handleVote('UPVOTE')}
                    disabled={votingLoading}
                    className="p-2 rounded-lg transition-colors text-gray-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-50"
                  >
                    {votingLoading ? (
                      <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-green-600"></div>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span className="text-xl font-bold text-gray-900">
                    {(note.upvotes || 0) - (note.downvotes || 0)}
                  </span>
                  <button
                    onClick={() => handleVote('DOWNVOTE')}
                    disabled={votingLoading}
                    className="p-2 rounded-lg transition-colors text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {votingLoading ? (
                      <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                  {note.isDraft && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Draft</span>}
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {note.type === 'PUBLIC' ? 'Public' : 'Private'}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {note.workspace?.name}
                  </span>
                  <span>•</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {note.tags.map(({ tag }) => (
                      <span key={tag.id} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="prose max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
