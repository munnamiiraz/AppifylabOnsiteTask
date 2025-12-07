import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCompaniesQuery, useGetWorkspacesQuery, useGetNoteQuery, useCreateNoteMutation, useUpdateNoteMutation } from '../store/api';
import { Company, Workspace } from '../types';

export default function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'PUBLIC' | 'PRIVATE'>('PRIVATE');
  const [isDraft, setIsDraft] = useState(false);
  const [tags, setTags] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');



  const { data: companies = [] } = useGetCompaniesQuery(undefined);
  const { data: workspaces = [] } = useGetWorkspacesQuery(selectedCompany, { skip: !selectedCompany });
  const { data: note } = useGetNoteQuery(id!, { skip: !id });
  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setType(note.type);
      setIsDraft(note.isDraft);
      setTags(note.tags?.map((t: any) => t.tag.name).join(', ') || '');
      setSelectedWorkspace(note.workspaceId);
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title,
        content,
        type,
        isDraft,
        workspaceId: selectedWorkspace,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (id) {
        await updateNote({ id, ...data }).unwrap();
      } else {
        await createNote(data).unwrap();
      }
      navigate('/');
    } catch {
      alert('Failed to save note');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit Note' : 'Create Note'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!id && (
          <>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">Select Workspace</option>
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </>
        )}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border rounded h-64"
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={type === 'PRIVATE'}
              onChange={() => setType('PRIVATE')}
            />
            Private
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={type === 'PUBLIC'}
              onChange={() => setType('PUBLIC')}
            />
            Public
          </label>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isDraft}
            onChange={(e) => setIsDraft(e.target.checked)}
          />
          Save as Draft
        </label>
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {id ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
