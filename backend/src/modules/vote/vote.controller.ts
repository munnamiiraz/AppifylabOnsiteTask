import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { VoteService } from './vote.service';

export class VoteController {
  static async vote(req: AuthRequest, res: Response) {
    try {
      const vote = await VoteService.vote(req.body, req.userId, req.ip);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Vote recorded successfully',
        data: vote,
        error: null,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Failed to vote',
        data: null,
        error: error.message,
      });
    }
  }
}
