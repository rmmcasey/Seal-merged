import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { corsHeaders, handleCorsPreFlight } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreFlight(request);
}

/**
 * POST /api/auth/login
 * Direct email/password login for the Chrome extension.
 * Returns a Supabase access token that the extension stores for API calls.
 */
export async function POST(request: NextRequest) {
  const headers = corsHeaders(request);

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400, headers }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: error?.message || 'Invalid email or password' },
        { status: 401, headers }
      );
    }

    return NextResponse.json({
      authenticated: true,
      email: data.user.email,
      token: data.session.access_token,
    }, { headers });
  } catch (err) {
    console.error('[Seal] Login API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers }
    );
  }
}
