import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';
import { CMS_TAG } from '@/lib/cms';

/**
 * Called by the admin panel after every save so visitors see the change immediately
 * instead of after the 60 second cache window. Requires a valid admin token.
 */
export async function POST(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (!authorization) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const me = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: authorization, Accept: 'application/json' }, cache: 'no-store' });
    if (!me.ok) return NextResponse.json({ ok: false }, { status: 401 });
    const user = await me.json();
    if (user?.role !== 'admin') return NextResponse.json({ ok: false }, { status: 403 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  revalidateTag(CMS_TAG);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
