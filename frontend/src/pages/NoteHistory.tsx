import { useParams, useNavigate } from 'react-router-dom';
import { useGetNoteHistoryQuery, useRestoreHistoryMutation } from '../store/api';
import { NoteHistory } from '../types';

export default function NoteHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: histories = [], isLoading } = useGetNoteHistoryQuery(id!);
  const [restoreHistory] = useRestoreHistoryMutation();

  const handleRestore = async (historyId: string) => {
    if (!confirm('Restore this version?')) return;
    try {
      await restoreHistory(historyId).unwrap();
      navigate('/');
    } catch {
      alert('Failed to restore');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Note History</h1>
      <button
        onClick={() => navigate('/')}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Back to Notes
      </button>

      <div className="space-y-4">
        {histories.map((history) => (
          <div key={history.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{history.title}</h3>
                <p className="text-gray-600 mt-2">{history.content.substring(0, 200)}...</p>
                <div className="text-sm text-gray-500 mt-2">
                  Modified by {history.user.name} on {new Date(history.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => handleRestore(history.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
