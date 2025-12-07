import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { HistoryService } from './history.service';

export class HistoryController {
  static async list(req: AuthRequest, res: Response) {
    try {
      const histories = await HistoryService.list(req.params.noteId as string, req.userId!);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'History fetched successfully',
        data: histories,
        error: null,
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        status: 403,
        message: 'Failed to fetch history',
        data: null,
        error: error.message || 'Access denied',
      });
    }
  }

  static async restore(req: AuthRequest, res: Response) {
    try {
      const note = await HistoryService.restore(req.params.historyId as string, req.userId!);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Note restored successfully',
        data: note,
        error: null,
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        status: 403,
        message: 'Failed to restore note',
        data: null,
        error: error.message || 'Access denied',
      });
    }
  }
}
