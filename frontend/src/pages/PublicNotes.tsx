import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPublicNotesQuery, useVoteMutation } from '../store/api';
import { Note } from '../types';

export default function PublicNotes() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');
  const navigate = useNavigate();
  const { data: notes = [], isLoading } = useGetPublicNotesQuery({ search, sort });
  const [voteOnNote] = useVoteMutation();

  const handleVote = async (noteId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    try {
      await voteOnNote({ noteId, voteType }).unwrap();
    } catch {
      alert('Failed to vote');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Public Notes Directory</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
          <option value="upvotes">Most Upvotes</option>
          <option value="downvotes">Most Downvotes</option>
        </select>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{note.title}</h3>
            <p className="text-gray-600 mt-2">{note.content.substring(0, 200)}...</p>
            <div className="flex gap-2 mt-2">
              {note.tags?.map((t) => (
                <span key={t.tag.id} className="bg-blue-100 px-2 py-1 rounded text-sm">
                  {t.tag.name}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Workspace: {note.workspace?.name} • Company: {note.workspace?.company?.name}
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleVote(note.id, 'UPVOTE')}
                className="flex items-center gap-1 text-green-600 hover:text-green-700"
              >
                ▲ {note.upvotes || 0}
              </button>
              <button
                onClick={() => handleVote(note.id, 'DOWNVOTE')}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                ▼ {note.downvotes || 0}
              </button>
              <button
                onClick={() => navigate(`/notes/${note.id}`)}
                className="text-blue-600 hover:text-blue-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
