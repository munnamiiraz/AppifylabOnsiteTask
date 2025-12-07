import { useParams } from 'react-router-dom';
import NoteHistoryViewer from '../components/NoteHistoryViewer';

export default function NoteHistory() {
  const { id } = useParams();
  return <NoteHistoryViewer noteId={id!} />;
}
