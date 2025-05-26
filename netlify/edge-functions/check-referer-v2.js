export default async (request, context) => {
  const referer = request.headers.get('referer');
  const requestUrl = request.url;

  console.log('Incoming request URL:', requestUrl);
  console.log('Referer header:', referer);

  const allowedReferers = [
    'https://pro-culinaria.ru',
    'https://pro-culinaria.ru/rulang',
  ];

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;
      const refererPathname = refererUrl.pathname.replace(/\/$/, '');

      console.log('Parsed Referer Origin:', refererOrigin);
      console.log('Parsed Referer Pathname (normalized):', refererPathname);

      const isAllowed = allowedReferers.includes(refererOrigin) || allowedReferers.includes(refererOrigin + refererPathname);

      console.log('Is referer allowed?', isAllowed);

      if (isAllowed) {
        // Если разрешено, просто позволяем запросу продолжить к статическим файлам
        return; // Важно: здесь мы ничего не возвращаем, чтобы запрос прошел дальше
      }
    } catch (e) {
      console.error("Invalid referer URL or parsing error:", referer, e);
    }
  } else {
    console.log('No referer header found.');
  }

  // Если реферер отсутствует или не разрешен, блокируем доступ
  console.log('Blocking request: Referer not allowed or missing.');
  return new Response('Доступ запрещен. Эта страница доступна только по ссылке с разрешенных источников.', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
