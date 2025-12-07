import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { WorkspaceService } from './workspace.service';

export class WorkspaceController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const workspace = await WorkspaceService.create(req.body, req.userId!);
      res.status(201).json({
        success: true,
        status: 201,
        message: 'Workspace created successfully',
        data: workspace,
        error: null,
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        status: 403,
        message: 'Failed to create workspace',
        data: null,
        error: error.message || 'Access denied',
      });
    }
  }

  static async list(req: AuthRequest, res: Response) {
    try {
      const workspaces = await WorkspaceService.list(req.query.companyId as string, req.userId!);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Workspaces fetched successfully',
        data: workspaces,
        error: null,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Failed to fetch workspaces',
        data: null,
        error: error.message,
      });
    }
  }
}
