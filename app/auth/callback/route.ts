import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * OAuth Callback Route
 * 
 * Обменивает code на сессию через SSR-клиент (записывает cookie).
 * После успешного обмена перенаправляет:
 * - admin (ansarnurlan2@gmail.com) → / (dashboard покажет admin-панель)
 * - обычные пользователи с заполненным профилем → /
 * - новые пользователи без профиля → / (покажет onboarding modal)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  const response = NextResponse.redirect(`${origin}${next}`);

  if (!code) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[auth/callback] exchangeCodeForSession error:', error.message);
      return NextResponse.redirect(`${origin}/?error=auth_failed`);
    }

    const user = data.session?.user;
    if (!user) {
      return NextResponse.redirect(`${origin}/?error=no_user`);
    }

    // Для admin email — принудительно обновляем/проверяем роль
    const userEmail = user.email?.toLowerCase().trim() ?? '';
    if (userEmail === 'ansarnurlan2@gmail.com') {
      // Гарантируем что профиль существует с ролью admin
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Ansarnurlan Admin',
        grade: 'Admin',
        role: 'admin',
        onboarding_completed: true,
      }, { onConflict: 'id' });
    }

  } catch (e) {
    console.error('[auth/callback] Unexpected error:', e);
    return NextResponse.redirect(`${origin}/?error=unexpected`);
  }

  return response;
}
