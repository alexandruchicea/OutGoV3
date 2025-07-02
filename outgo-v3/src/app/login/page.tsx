import { createClient } from '~/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SubmitButton } from '@/components/submit-button';

export default async function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/');
  };

  const signUp = async (formData: FormData) => {
    'use server';

    const origin = (await headers()).get('origin');
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/login?message=Check email to verify account');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SubmitButton formAction={signIn} className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2" pendingText="Signing In...">
            Sign In
          </SubmitButton>
          <SubmitButton formAction={signUp} className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2" pendingText="Signing Up...">
            Sign Up
          </SubmitButton>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <SubmitButton formAction={async () => {
            'use server';
            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${(await headers()).get('origin')}/auth/callback`,
              },
            });
            if (error) {
              return redirect('/login?message=Could not authenticate user');
            }
            return redirect(data.url);
          }} className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2" pendingText="Redirecting...">
            Sign In with Google
          </SubmitButton>
          <SubmitButton formAction={async () => {
            'use server';
            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: 'apple',
              options: {
                redirectTo: `${(await headers()).get('origin')}/auth/callback`,
              },
            });
            if (error) {
              return redirect('/login?message=Could not authenticate user');
            }
            return redirect(data.url);
          }} className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2" pendingText="Redirecting...">
            Sign In with Apple
          </SubmitButton>
          {(await searchParams)?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {(await searchParams).message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
