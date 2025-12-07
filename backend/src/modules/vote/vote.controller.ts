import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { VoteService } from './vote.service';
import prisma from '../../config/database';

export class VoteController {
  static async vote(req: AuthRequest, res: Response) {
    try {
      await VoteService.vote(req.body, req.userId, req.ip);
      
      const votes = await prisma.vote.findMany({ where: { noteId: req.body.noteId } });
      const upvotes = votes.filter(v => v.voteType === 'UPVOTE').length;
      const downvotes = votes.filter(v => v.voteType === 'DOWNVOTE').length;
      
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Vote recorded successfully',
        data: { upvotes, downvotes },
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
