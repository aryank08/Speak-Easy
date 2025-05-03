import { openDB, DBSchema } from 'idb';
import bcrypt from 'bcryptjs';
import jwtEncode from 'jwt-encode';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

interface TextSegment {
  text: string;
  voice: string;
  pitch: number;
  rate: number;
  volume: number;
}

interface Conversion {
  id: string;
  userId: string;
  name: string;
  segments: TextSegment[];
  createdAt: Date;
}

interface MyDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string };
  };
  conversions: {
    key: string;
    value: Conversion;
    indexes: { 'by-user': string };
  };
}

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

const dbPromise = openDB<MyDB>('auth-db', 1, {
  upgrade(db) {
    // Users store
    const userStore = db.createObjectStore('users', { keyPath: 'id' });
    userStore.createIndex('by-email', 'email', { unique: true });

    // Conversions store
    const conversionStore = db.createObjectStore('conversions', { keyPath: 'id' });
    conversionStore.createIndex('by-user', 'userId');
  },
});

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export const auth = {
  async register(name: string, email: string, password: string): Promise<AuthUser> {
    const db = await dbPromise;
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    const user: User = {
      id,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    try {
      await db.add('users', user);
      return { id, name, email };
    } catch (error) {
      if ((error as any).name === 'ConstraintError') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  },

  async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    const db = await dbPromise;
    const user = await db.getFromIndex('users', 'by-email', email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

    const token = jwtEncode(
      { id: user.id, email: user.email },
      JWT_SECRET
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };
  },

  async verifyToken(token: string): Promise<AuthUser> {
    try {
      const decoded = jwtDecode(token) as any;
      const db = await dbPromise;
      const user = await db.get('users', decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};

export const conversions = {
  async save(userId: string, name: string, segments: TextSegment[]): Promise<Conversion> {
    const db = await dbPromise;
    const conversion: Conversion = {
      id: crypto.randomUUID(),
      userId,
      name,
      segments,
      createdAt: new Date()
    };

    await db.add('conversions', conversion);
    return conversion;
  },

  async getByUser(userId: string): Promise<Conversion[]> {
    const db = await dbPromise;
    const index = db.transaction('conversions').store.index('by-user');
    return index.getAll(userId);
  },

  async delete(id: string): Promise<void> {
    const db = await dbPromise;
    await db.delete('conversions', id);
  }
};

export const aiEnhance = {
  async enhance(text: string, type: 'professional' | 'simple' | 'friendly' | 'summary'): Promise<string> {
    // Simulated AI text enhancement
    const transformations: Record<string, (text: string) => string> = {
      professional: (text) => `${text} [Enhanced for professional tone]`,
      simple: (text) => `${text} [Simplified for clarity]`,
      friendly: (text) => `${text} [Made more conversational]`,
      summary: (text) => `Summary: ${text.split(' ').slice(0, 20).join(' ')}...`
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return transformations[type](text);
  }
};