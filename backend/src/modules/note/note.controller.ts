import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { NoteService } from './note.service';

export class NoteController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const note = await NoteService.create(req.body, req.userId!);
      res.status(201).json({
        success: true,
        status: 201,
        message: 'Note created successfully',
        data: note,
        error: null,
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        status: 403,
        message: 'Failed to create note',
        data: null,
        error: error.message || 'Access denied',
      });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const note = await NoteService.update(req.params.id, req.body, req.userId!);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Note updated successfully',
        data: note,
        error: null,
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        status: 403,
        message: 'Failed to update note',
        data: null,
        error: error.message || 'Access denied',
      });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      await NoteService.delete(req.params.id, req.userId!);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Note deleted successfully',
        data: null,
        error: null,
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        status: 403,
        message: 'Failed to delete note',
        data: null,
        error: error.message || 'Access denied',
      });
    }
  }

  static async listPrivate(req: AuthRequest, res: Response) {
    try {
      const notes = await NoteService.listPrivate(req.query, req.userId!);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Private notes fetched successfully',
        data: notes,
        error: null,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Failed to fetch notes',
        data: null,
        error: error.message,
      });
    }
  }

  static async listPublic(req: Request, res: Response) {
    try {
      const notes = await NoteService.listPublic(req.query);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Public notes fetched successfully',
        data: notes,
        error: null,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Failed to fetch notes',
        data: null,
        error: error.message,
      });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const note = await NoteService.getOne(req.params.id);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Note fetched successfully',
        data: note,
        error: null,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        status: 404,
        message: 'Note not found',
        data: null,
        error: error.message,
      });
    }
  }
}
