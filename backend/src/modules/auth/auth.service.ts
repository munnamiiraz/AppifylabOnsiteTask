import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';

export class AuthService {
  static async register(data: { email: string; password: string; name: string; companyName?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
      data: { email: data.email, password: hashedPassword, name: data.name },
      select: { id: true, email: true, name: true },
    });

    if (data.companyName) {
      await prisma.company.create({
        data: {
          name: data.companyName,
          users: { create: { userId: user.id, role: 'owner' } },
        },
      });
    }

    return user;
  }

  static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }
}
