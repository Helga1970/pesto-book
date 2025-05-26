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
      const refererOrigin = refererUrl.origin.replace(/\/$/, '');
      const refererHost = refererUrl.hostname;
      const refererPathname = refererUrl.pathname.replace(/\/$/, '');

      console.log('Parsed Referer Origin:', refererOrigin);
      console.log('Parsed Referer Host:', refererHost);
      console.log('Parsed Referer Pathname:', refererPathname);

      // Собираем варианты для проверки
      const variantsToCheck = [
        refererHost,
        refererHost + refererPathname,
        refererOrigin,
        refererOrigin + refererPathname,
      ];

      const isAllowed = variantsToCheck.some(v => allowedReferers.includes(v));

      console.log('Is referer allowed?', isAllowed);

      if (isAllowed) {
        return context.next();
      }
    } catch (e) {
      console.error("Invalid referer URL or parsing error:", referer, e);
    }
  } else {
    console.log('No referer header found.');
  }

  console.log('Blocking request: Referer not allowed or missing.');
  return new Response('Доступ запрещен. Эта страница доступна только по ссылке с разрешенных источников.', {
    status: 403,
    headers: {
      'Content-Type': 'text
