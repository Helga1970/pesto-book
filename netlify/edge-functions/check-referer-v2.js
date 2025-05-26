export default async (request, context) => {
  const referer = request.headers.get('referer');
  const requestUrl = request.url;

  console.log('Incoming request URL:', requestUrl);
  console.log('Referer header:', referer);

  const allowedReferers = [
    'pro-culinaria.ru',
    'pro-culinaria.ru/rulang',
    'https://pro-culinaria.ru',
    'https://pro-culinaria.ru/rulang',
  ];

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin.replace(/^https?:\/\//, '');
      const refererPathname = refererUrl.pathname.replace(/\/$/, '');

      console.log('Parsed Referer Origin (without protocol):', refererOrigin);
      console.log('Parsed Referer Pathname (normalized):', refererPathname);

      const combinedReferer = refererOrigin + refererPathname;

      const isAllowed = allowedReferers.includes(refererOrigin) || allowedReferers.includes(combinedReferer);

      console.log('Is referer allowed?', isAllowed);

      if (isAllowed) {
        // Разрешаем запрос пройти дальше
        return;
      }
    } catch (e) {
      console.error('Invalid referer URL or parsing error:', referer, e);
    }
  } else {
    console.log('No referer header found.');
  }

  console.log('Blocking request: Referer not allowed or missing.');
  return new Response('Доступ запрещен. Эта страница доступна только по ссылке с разрешенных источников.', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
