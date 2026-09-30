/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Временно оставляем игнорирование TS-ошибок для плавной миграции
  // После финального теста рекомендуется убрать typescript.ignoreBuildErrors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Оптимизация изображений
  images: {
    domains: ['lh3.googleusercontent.com', 'tltankihglovzfvveyif.supabase.co'],
  },
};

module.exports = nextConfig;
