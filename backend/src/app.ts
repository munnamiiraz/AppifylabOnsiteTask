import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes';
import companyRoutes from './modules/company/company.routes';
import workspaceRoutes from './modules/workspace/workspace.routes';
import noteRoutes from './modules/note/note.routes';
import voteRoutes from './modules/vote/vote.routes';
import historyRoutes from './modules/history/history.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000,
  message: 'Too many requests',
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/history', historyRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

export default app;
