export default async (request, context) => {
  const referer = request.headers.get('referer');
  const requestUrl = request.url;

  console.log('Incoming request URL:', requestUrl);
  console.log('Referer header:', referer);

  // Разрешённые домены
  const allowedReferers = [
    'https://pro-culinaria.ru',
    'http://pro-culinaria.ru',
    'https://www.pro-culinaria.ru',
    'http://www.pro-culinaria.ru',
    'pro-culinaria.ru',
    'www.pro-culinaria.ru',
  ];

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;

      console.log('Parsed Referer Origin:', refererOrigin);

      const isAllowed = allowedReferers.includes(refererOrigin);

      console.log('Is referer allowed?', isAllowed);

      if (isAllowed) {
        // Если реферер разрешён, пропускаем запрос
        return context.next();
      }
    } catch (e) {
      console.error("Invalid referer URL or parsing error:", referer, e);
    }
  } else {
    console.log('No referer header found.');
  }

  // Если реферер отсутствует или не разрешён, блокируем доступ
  console.log('Blocking request: Referer not allowed or missing.');
  return new Response('Access Denied: This page is only accessible from allowed sources.', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
