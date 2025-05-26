export default async (request, context) => {
  const referer = request.headers.get('referer');
  const requestUrl = request.url; // Добавим логирование URL запроса

  // Логируем referer и URL запроса, чтобы увидеть, что приходит
  console.log('Incoming request URL:', requestUrl);
  console.log('Referer header:', referer);

  const allowedReferers = [
    'https://pro-culinaria.ru',
    'https://pro-culinaria.ru/rulang',
    // Добавьте здесь любые другие разрешенные домены, если это необходимо
  ];

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;
      const refererPathname = refererUrl.pathname.replace(/\/$/, ''); // Удаляем конечный слеш

      console.log('Parsed Referer Origin:', refererOrigin);
      console.log('Parsed Referer Pathname (normalized):', refererPathname);

      // Проверяем, соответствует ли реферер одному из разрешенных
      const isAllowed = allowedReferers.includes(refererOrigin) || allowedReferers.includes(refererOrigin + refererPathname);

      console.log('Is referer allowed?', isAllowed);

      if (isAllowed) {
        return; // Пропускаем запрос
      }
    } catch (e) {
      console.error("Invalid referer URL or parsing error:", referer, e);
    }
  } else {
    console.log('No referer header found.');
  }

  // Если реферер отсутствует, не является валидным URL или не в списке разрешенных, возвращаем 403 Forbidden
  console.log('Blocking request: Referer not allowed or missing.');
  return new Response('Доступ запрещен. Эта страница доступна только по ссылке с разрешенных источников.', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
