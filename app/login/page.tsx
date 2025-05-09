import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  try {
    const session = await getServerSession(nextAuthOptions);
    
    if (session) {
      redirect('/dashboard');
    }
  } catch (error) {
    console.error('Error checking session:', error);
    // Continue to login page if there's an error checking the session
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
          <h1 className="text-center text-3xl font-bold tracking-tight text-primary">Licentia</h1>
          <h2 className="mt-2 text-center text-sm text-muted-foreground">Sign in to your account</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
} 