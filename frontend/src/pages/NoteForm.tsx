import { useParams } from 'react-router-dom';
import NoteEditor from '../components/NoteEditor';

export default function NoteForm() {
  const { id } = useParams();
  return <NoteEditor noteId={id} mode={id ? 'edit' : 'create'} />;
}
