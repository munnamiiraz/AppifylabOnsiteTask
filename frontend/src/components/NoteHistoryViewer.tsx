import React, { useState, useEffect } from 'react';

interface HistoryEntry {
  id: number;
  noteId: number;
  title: string;
  content: string;
  updatedBy: string;
  updatedAt: string;
  changesSummary: string;
}

interface CurrentNote {
  id: number;
  title: string;
  content: string;
  workspaceId: number;
  workspace: string;
}

interface Props {
  noteId: string;
}

const NoteHistoryViewer: React.FC<Props> = ({ noteId }) => {
  const [currentNote, setCurrentNote] = useState<CurrentNote | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryEntry | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comparing, setComparing] = useState<boolean>(false);

  // Dummy data
  const dummyCurrentNote: CurrentNote = {
    id: 1,
    title: 'API Design Best Practices - Updated',
    content: 'This is the current version of the note with latest updates...\n\nKey principles:\n1. RESTful design\n2. Proper HTTP methods\n3. Clear error messages\n4. Versioning strategy',
    workspaceId: 101,
    workspace: 'Engineering'
  };

  const dummyHistory: HistoryEntry[] = [
    {
      id: 5,
      noteId: 1,
      title: 'API Design Best Practices - Updated',
      content: 'This is the current version of the note with latest updates...\n\nKey principles:\n1. RESTful design\n2. Proper HTTP methods\n3. Clear error messages\n4. Versioning strategy',
      updatedBy: 'John Doe',
      updatedAt: '2024-03-15T14:30:00Z',
      changesSummary: 'Added versioning strategy section'
    },
    {
      id: 4,
      noteId: 1,
      title: 'API Design Best Practices',
      content: 'This is an earlier version...\n\nKey principles:\n1. RESTful design\n2. Proper HTTP methods\n3. Clear error messages',
      updatedBy: 'John Doe',
      updatedAt: '2024-03-14T10:15:00Z',
      changesSummary: 'Added error handling section'
    },
    {
      id: 3,
      noteId: 1,
      title: 'API Design Best Practices',
      content: 'This is an even earlier version...\n\nKey principles:\n1. RESTful design\n2. Proper HTTP methods',
      updatedBy: 'Jane Smith',
      updatedAt: '2024-03-13T16:45:00Z',
      changesSummary: 'Added HTTP methods explanation'
    },
    {
      id: 2,
      noteId: 1,
      title: 'API Design Best Practices',
      content: 'Initial draft with basic content...\n\nKey principles:\n1. RESTful design',
      updatedBy: 'Jane Smith',
      updatedAt: '2024-03-12T09:00:00Z',
      changesSummary: 'Initial version'
    },
    {
      id: 1,
      noteId: 1,
      title: 'API Design',
      content: 'Very first version - just started writing...',
      updatedBy: 'John Doe',
      updatedAt: '2024-03-11T14:20:00Z',
      changesSummary: 'Created note'
    }
  ];

  useEffect(() => {
    fetchNoteAndHistory();
  }, [noteId]);

  const fetchNoteAndHistory = async (): Promise<void> => {
    setLoading(true);
    try {
      // Replace with actual API calls
      // const noteResponse = await fetch(`/api/notes/${noteId}`);
      // const historyResponse = await fetch(`/api/notes/${noteId}/history`);
      // const noteData = await noteResponse.json();
      // const historyData = await historyResponse.json();
      
      setTimeout(() => {
        setCurrentNote(dummyCurrentNote);
        setHistory(dummyHistory);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching history:', error);
      setLoading(false);
    }
  };

  const handleRestore = async (historyEntry: HistoryEntry): Promise<void> => {
    try {
      // Replace with actual API call
      // await fetch(`/api/notes/${noteId}/restore`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ historyId: historyEntry.id })
      // });
      
      setTimeout(() => {
        alert('Note restored successfully!');
        setShowRestoreModal(false);
        fetchNoteAndHistory();
      }, 500);
    } catch (error) {
      console.error('Error restoring note:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading history...</p>
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
                onClick={() => window.location.href = `/notes/${noteId}`}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                View Note
              </button>
              <button
                onClick={() => window.location.href = `/notes/${noteId}/edit`}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Edit Note
              </button>
              <button
                onClick={() => window.location.href = '/workspaces'}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Back to Workspaces
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Version History</h1>
            <span className="text-sm text-gray-600">
              {history.length} version{history.length !== 1 ? 's' : ''} • Last 7 days
            </span>
          </div>
          <p className="text-gray-600">
            {currentNote?.title} • {currentNote?.workspace}
          </p>
        </div>

        {/* Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Version Retention Policy</h3>
              <p className="text-sm text-blue-800 mt-1">
                History entries are automatically retained for 7 days. After this period, older versions are permanently deleted.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Version Timeline</h2>
              </div>
              <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                <div className="space-y-3">
                  {history.map((entry, index) => (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedHistory(entry)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedHistory?.id === entry.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                              Current
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(entry.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {entry.changesSummary}
                      </p>
                      <p className="text-xs text-gray-600">
                        by {entry.updatedBy}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(entry.updatedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            {selectedHistory ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedHistory.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Version from {formatDate(selectedHistory.updatedAt)}</span>
                        <span>•</span>
                        <span>Updated by {selectedHistory.updatedBy}</span>
                      </div>
                    </div>
                    {selectedHistory.id !== history[0].id && (
                      <button
                        onClick={() => setShowRestoreModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Restore This Version</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap">
                      {selectedHistory.content}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Version Selected</h3>
                <p className="text-gray-600">Select a version from the timeline to preview</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Restore Confirmation Modal */}
      {showRestoreModal && selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Restore Version?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to restore this version? The current version will be saved in history, and this version will become the active note.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Version from:</span> {formatDate(selectedHistory.updatedAt)}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Updated by:</span> {selectedHistory.updatedBy}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRestore(selectedHistory)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Restore Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteHistoryViewer;