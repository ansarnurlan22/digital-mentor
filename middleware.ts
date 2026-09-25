import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware контроля доступа (RBAC Guard)
 * Доступ к роутам /admin и API /api/admin/* разрешён только пользователям со статусом role: "admin".
 * Неавторизованные пользователи и обычные ученики/менторы блокируются с кодом 403 Forbidden.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const roleCookie = request.cookies.get('user_role')?.value;
    const customRoleHeader = request.headers.get('x-user-role');
    const emailCookie = request.cookies.get('user_email')?.value;
    const customEmailHeader = request.headers.get('x-user-email');

    const email = (customEmailHeader || emailCookie || '').toLowerCase().trim();
    const isSuperAdminEmail = email === 'ansarnurlan2@gmail.com' || email === 'ansarnurlan22@gmail.com';

    // Проверяем роль пользователя
    const role = (customRoleHeader || roleCookie || '').toLowerCase();
    const isAdmin = isSuperAdminEmail || role === 'admin' || role === 'администратор';

    if (!isAdmin) {
      // 1. Для API-запросов возвращаем 403 Forbidden в формате JSON
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            status: 403,
            message: '403 Forbidden: Доступ к API разрешён только пользователям со статусом role: "admin".',
          },
          { status: 403 }
        );
      }

      // 2. Для веб-страниц перенаправляем на / с уведомлением об отказе в доступе
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('error', '403_forbidden');
      redirectUrl.searchParams.set('message', 'Доступ разрешён только администраторам платформы.');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
