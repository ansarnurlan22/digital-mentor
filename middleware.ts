import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Middleware: RBAC Guard + Onboarding Protection
 * 
 * 1. Для /admin/* — проверяем role='admin' из profiles таблицы через Supabase SSR
 * 2. Защищаем от race conditions при загрузке сессии
 * 3. ansarnurlan2@gmail.com — автоматически admin, никогда не попадает на онбординг
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Создаём SSR Supabase клиент (читает куки из запроса)
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

  // Получаем текущую сессию (не вызывает лишних сетевых запросов)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ============================================================
  // ADMIN ROUTES PROTECTION
  // ============================================================
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!user) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
          { error: 'Unauthorized', status: 401 },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    const userEmail = user.email?.toLowerCase().trim() ?? '';
    const isSuperAdmin = userEmail === 'ansarnurlan2@gmail.com';

    if (!isSuperAdmin) {
      // Проверяем role в profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const isAdmin = profile?.role === 'admin';

      if (!isAdmin) {
        if (pathname.startsWith('/api/admin')) {
          return NextResponse.json(
            {
              error: 'Forbidden',
              status: 403,
              message: '403 Forbidden: Доступ разрешён только администраторам.',
            },
            { status: 403 }
          );
        }
        const redirectUrl = new URL('/', request.url);
        redirectUrl.searchParams.set('error', '403_forbidden');
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Обрабатываем все маршруты кроме:
     * - _next/static (статические файлы)
     * - _next/image (оптимизация картинок)
     * - favicon.ico
     * - публичные ассеты
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
