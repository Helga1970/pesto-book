import { URL } from 'url';

export default async (request, context) => {
  const referer = request.headers.get('referer');
  const allowedReferers = [
    'https://pro-culinaria.ru/',
    'https://pro-culinaria.ru/rulang/'
    // Добавьте здесь любые другие разрешенные рефереры, если это необходимо
  ];

  if (referer) {
    const refererUrl = new URL(referer);
    // Проверяем, соответствует ли реферер одному из разрешенных
    if (allowedReferers.includes(refererUrl.origin + refererUrl.pathname)) {
      // Если разрешено, просто завершаем выполнение функции.
      // Netlify автоматически продолжит обработку запроса к вашему сайту.
      return;
    }
  }

  // Если реферер отсутствует или не в списке разрешенных, возвращаем 403 Forbidden
  return new Response('Доступ запрещен. Эта страница доступна только по ссылке с разрешенных источников.', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};