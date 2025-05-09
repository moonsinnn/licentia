import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { hash } from 'bcrypt';
import { nextAuthOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkRole } from '@/lib/api-utils';

// Define response type for better type safety
type UserResponse = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  created_at: Date;
};

// GET - Fetch all users
export async function GET(req: NextRequest) {
  try {
    // Authenticate the request
    const session = await getServerSession(nextAuthOptions);

    // Check if the user is authenticated and is a super_admin
    const authCheck = await checkRole('super_admin');
    if (!authCheck) {
      return NextResponse.json(
        { error: 'Unauthorized: Only super admins can access this resource' },
        { status: 403 }
      );
    }

    // Fetch all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Transform BigInt ids to strings for JSON serialization
    const serializedUsers = users.map(user => ({
      ...user,
      id: user.id.toString(),
    }));

    // Return the users
    return NextResponse.json(serializedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create a new user
export async function POST(req: NextRequest) {
  try {
    // Authenticate the request
    const session = await getServerSession(nextAuthOptions);

    // Check if the user is authenticated and is a super_admin
    const authCheck = await checkRole('super_admin');
    if (!authCheck) {
      return NextResponse.json(
        { error: 'Unauthorized: Only super admins can create users' },
        { status: 403 }
      );
    }

    // Parse the request body
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if a user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the new user with 'admin' role by default
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin', // Default role for new users
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
      },
    });

    // Return the new user with id converted to string
    return NextResponse.json(
      {
        ...newUser,
        id: newUser.id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 