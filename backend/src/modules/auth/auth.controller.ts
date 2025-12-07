import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        status: 201,
        message: 'User registered successfully',
        data: user,
        error: null,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        status: 400,
        message: 'Registration failed',
        data: null,
        error: error.message || 'User already exists',
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Login successful',
        data: result,
        error: null,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        status: 401,
        message: 'Login failed',
        data: null,
        error: error.message || 'Invalid credentials',
      });
    }
  }
}
