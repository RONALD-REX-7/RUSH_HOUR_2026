import { User, IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-super-secret-jwt-key', {
    expiresIn: '30d',
  });
};

export const authService = {
  async registerUser(userData: any) {
    const { name, email, password, role } = userData;
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'citizen',
    });
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken((user._id as unknown as { toString(): string }).toString()),
    };
  },

  async loginUser(email: string, role: IUser['role']) {
    // Note: To support the existing mock login which only sends role and email (sometimes)
    // We'll create a user if not found for seamless testing, or just use passwordless if requested by mock
    let user = await User.findOne({ role }); // Simplified for demo if email isn't provided
    if (email) {
      user = await User.findOne({ email, role });
    }
    
    if (!user) {
       // Auto create for demo purpose to keep UI working without real register page
       user = await User.create({
         name: role === 'admin' ? 'Admin User' : role === 'entrepreneur' ? 'Ent User' : 'Citizen User',
         email: email || `${role}@example.com`,
         role: role,
         password: await bcrypt.hash('password', 10)
       });
    }

    return {
      _id: user._id,
      id: user._id, // map to existing frontend expect
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.profileImage,
      token: generateToken((user._id as unknown as { toString(): string }).toString()),
    };
  },

  async getUserProfile(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }
};
