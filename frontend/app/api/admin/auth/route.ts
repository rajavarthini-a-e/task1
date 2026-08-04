import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';
const COOKIE_NAME = 'admin_session_token';

// Secret token for session verification
const VALID_TOKEN_VALUE = 'eduai_admin_session_active_v1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate credentials
    const isUsernameValid = username.trim().toLowerCase() === DEFAULT_ADMIN_USER.toLowerCase();
    const isPasswordValid = password === DEFAULT_ADMIN_PASS;

    if (!isUsernameValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Set HTTP-Only Cookie
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, VALID_TOKEN_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: { username: DEFAULT_ADMIN_USER, role: 'Administrator' },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (token === VALID_TOKEN_VALUE) {
      return NextResponse.json({
        authenticated: true,
        user: { username: DEFAULT_ADMIN_USER, role: 'Administrator' },
      });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();
    cookieStore.delete(COOKIE_NAME);
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
