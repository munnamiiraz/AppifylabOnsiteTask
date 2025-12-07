import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { CompanyService } from './company.service';

export class CompanyController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const company = await CompanyService.create(req.body.name, req.userId!);
      res.status(201).json({
        success: true,
        status: 201,
        message: 'Company created successfully',
        data: company,
        error: null,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Failed to create company',
        data: null,
        error: error.message,
      });
    }
  }

  static async list(req: AuthRequest, res: Response) {
    try {
      const companies = await CompanyService.list(req.userId!);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Companies fetched successfully',
        data: companies,
        error: null,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Failed to fetch companies',
        data: null,
        error: error.message,
      });
    }
  }
}
