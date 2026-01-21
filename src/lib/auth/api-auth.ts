/**
 * Authentication utilities for API routes
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';

interface AuthResult {
  user: User;
  profile: Profile | null;
}

interface AuthError {
  error: string;
  status: number;
}

type GetAuthResult = { success: true; data: AuthResult } | { success: false; error: AuthError };

/**
 * Get authenticated user from request (for API routes)
 * Uses cookies to validate the session
 */
export async function getAuthenticatedUser(): Promise<GetAuthResult> {
  try {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: {
          error: 'Unauthorized - Please log in',
          status: 401,
        },
      };
    }

    // Optionally fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      success: true,
      data: {
        user,
        profile: profile as Profile | null,
      },
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      success: false,
      error: {
        error: 'Authentication error',
        status: 500,
      },
    };
  }
}

/**
 * Middleware helper to require authentication
 * Returns NextResponse with error if not authenticated
 */
export async function requireAuth(): Promise<
  { authenticated: true; user: User; profile: Profile | null } | 
  { authenticated: false; response: NextResponse }
> {
  const result = await getAuthenticatedUser();

  if (!result.success) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: result.error.error },
        { status: result.error.status }
      ),
    };
  }

  return {
    authenticated: true,
    user: result.data.user,
    profile: result.data.profile,
  };
}

/**
 * Check if user has admin role
 */
export async function requireAdmin(): Promise<
  { authorized: true; user: User; profile: Profile } | 
  { authorized: false; response: NextResponse }
> {
  const authResult = await requireAuth();

  if (!authResult.authenticated) {
    return { authorized: false, response: authResult.response };
  }

  if (!authResult.profile || authResult.profile.role !== 'admin') {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user: authResult.user,
    profile: authResult.profile,
  };
}

/**
 * Check if user has access to a specific sector
 */
export async function requireSectorAccess(sector: string): Promise<
  { authorized: true; user: User; profile: Profile } | 
  { authorized: false; response: NextResponse }
> {
  const authResult = await requireAuth();

  if (!authResult.authenticated) {
    return { authorized: false, response: authResult.response };
  }

  const profile = authResult.profile;
  
  // Admins have access to all sectors
  if (profile?.role === 'admin') {
    return {
      authorized: true,
      user: authResult.user,
      profile: profile,
    };
  }

  // Check if user has the sector in their allowed sectors
  if (!profile?.sectors?.includes(sector as any)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden - You do not have access to this sector' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user: authResult.user,
    profile: profile,
  };
}

/**
 * Get user ID from request or return error response
 */
export async function getUserIdOrError(): Promise<
  { userId: string } | { response: NextResponse }
> {
  const result = await getAuthenticatedUser();

  if (!result.success) {
    return {
      response: NextResponse.json(
        { error: result.error.error },
        { status: result.error.status }
      ),
    };
  }

  return { userId: result.data.user.id };
}
