import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPrivateNotesQuery, useDeleteNoteMutation } from '../store/api';
import { Note } from '../types';

export default function PrivateNotes() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data: notes = [], isLoading } = useGetPrivateNotesQuery({ search });
  const [deleteNote] = useDeleteNoteMutation();

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    try {
      await deleteNote(id).unwrap();
    } catch {
      alert('Failed to delete note');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <button
          onClick={() => navigate('/notes/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Note
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-6"
      />

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{note.title}</h3>
                <p className="text-gray-600 mt-2">{note.content.substring(0, 150)}...</p>
                <div className="flex gap-2 mt-2">
                  {note.tags?.map((t) => (
                    <span key={t.tag.id} className="bg-gray-200 px-2 py-1 rounded text-sm">
                      {t.tag.name}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {note.type} • {note.isDraft ? 'Draft' : 'Published'} • {note.workspace?.name}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/notes/edit/${note.id}`)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/notes/history/${note.id}`)}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  History
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
