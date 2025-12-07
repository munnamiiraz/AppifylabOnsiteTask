import React, { useState, useEffect } from 'react';

interface Workspace {
  id: number;
  name: string;
}

interface NoteData {
  id?: number;
  title: string;
  content: string;
  workspaceId: number;
  tags: string[];
  isPublic: boolean;
  isDraft: boolean;
}

interface Props {
  noteId?: string;
  mode: 'create' | 'edit';
}

const NoteEditor: React.FC<Props> = ({ noteId, mode }) => {
  const [note, setNote] = useState<NoteData>({
    title: '',
    content: '',
    workspaceId: 0,
    tags: [],
    isPublic: false,
    isDraft: true
  });
  const [tagInput, setTagInput] = useState<string>('');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Dummy workspaces
  const dummyWorkspaces: Workspace[] = [
    { id: 101, name: 'Engineering' },
    { id: 102, name: 'Product' },
    { id: 103, name: 'Marketing' },
    { id: 104, name: 'General' }
  ];

  useEffect(() => {
    setWorkspaces(dummyWorkspaces);
    if (mode === 'edit' && noteId) {
      fetchNote();
    } else {
      // Set default workspace
      setNote(prev => ({ ...prev, workspaceId: dummyWorkspaces[0].id }));
    }
  }, [noteId, mode]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (note.title || note.content) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [note.title, note.content]);

  const fetchNote = async (): Promise<void> => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch(`/api/notes/${noteId}`);
      // const data = await response.json();
      // setNote(data);
      
      setTimeout(() => {
        setNote({
          id: 1,
          title: 'Sample Note Title',
          content: 'This is sample content...',
          workspaceId: 101,
          tags: ['sample', 'demo'],
          isPublic: false,
          isDraft: true
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching note:', error);
      setLoading(false);
    }
  };

  const saveDraft = async (): Promise<void> => {
    if (!note.title && !note.content) return;
    
    setSaving(true);
    try {
      // Replace with actual API call
      // await fetch('/api/notes/draft', {
      //   method: mode === 'create' ? 'POST' : 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...note, isDraft: true })
      // });
      
      setTimeout(() => {
        setLastSaved(new Date());
        setSaving(false);
      }, 500);
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaving(false);
    }
  };

  const handlePublish = async (): Promise<void> => {
    if (!note.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!note.content.trim()) {
      alert('Please enter content');
      return;
    }
    if (!note.workspaceId) {
      alert('Please select a workspace');
      return;
    }

    setSaving(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/notes', {
      //   method: mode === 'create' ? 'POST' : 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...note, isDraft: false })
      // });
      // const data = await response.json();
      
      setTimeout(() => {
        setSaving(false);
        alert('Note published successfully!');
        window.location.href = '/workspaces';
      }, 500);
    } catch (error) {
      console.error('Error publishing note:', error);
      setSaving(false);
    }
  };

  const handleAddTag = (): void => {
    if (tagInput.trim() && !note.tags.includes(tagInput.trim())) {
      setNote({ ...note, tags: [...note.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    setNote({ ...note, tags: note.tags.filter(tag => tag !== tagToRemove) });
  };

  const formatLastSaved = (): string => {
    if (!lastSaved) return '';
    const seconds = Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
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
            <div className="flex items-center space-x-4">
              {/* Draft Indicator */}
              {note.isDraft && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-yellow-800">Draft</span>
                </div>
              )}
              
              {/* Save Status */}
              <div className="text-sm text-gray-600">
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span>Saved {formatLastSaved()}</span>
                ) : null}
              </div>

              <button
                onClick={() => window.location.href = '/workspaces'}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveDraft}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                disabled={saving}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {note.isDraft ? 'Publish' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'create' ? 'Create New Note' : 'Edit Note'}
            </h1>
            {mode === 'edit' && (
              <button
                onClick={() => window.location.href = `/notes/${noteId}/history`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View History
              </button>
            )}
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              placeholder="Enter note title..."
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Workspace Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace *
            </label>
            <select
              value={note.workspaceId}
              onChange={(e) => setNote({ ...note, workspaceId: Number(e.target.value) })}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value={0}>Select a workspace</option>
              {workspaces.map(workspace => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              placeholder="Write your note content here..."
              rows={15}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-y"
            />
          </div>

          {/* Tags Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                Add Tag
              </button>
            </div>
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Visibility Toggle */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={note.isPublic}
                onChange={(e) => setNote({ ...note, isPublic: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Make this note public</span>
                <p className="text-xs text-gray-500">Public notes will appear in the public directory</p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={() => window.location.href = '/workspaces'}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex space-x-3">
              <button
                onClick={saveDraft}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                onClick={handlePublish}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Publishing...' : note.isDraft ? 'Publish Note' : 'Update Note'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoteEditor;