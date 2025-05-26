[[edge_functions]]
path = "/*"
function = "check-referer-v2"

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
    // 'pro-culinaria.ru', // ЭТО ЛИШНЕЕ, Т.К. refererUrl.origin всегда будет содержать протокол
    // 'www.pro-culinaria.ru', // ЭТО ЛИШНЕЕ

    // Добавляем домен самого Netlify сайта, чтобы он мог загружать свои ресурсы
    'https://pesto-book.netlify.app',
    'http://pesto-book.netlify.app', // В случае, если кто-то зайдёт по http
  ];

  // Также можно добавить более гибкую проверку для своего же домена,
  // если запросы идут напрямую к ресурсам без реферера
  const requestOrigin = new URL(requestUrl).origin;
  if (allowedReferers.includes(requestOrigin)) {
      console.log('Request origin is allowed, skipping referer check.');
      return context.next();
  }


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
    // Если реферер отсутствует, нужно решить, что делать.
    // Если это прямой заход на ресурс, то он будет заблокирован текущей логикой.
    // Если это первый запрос к странице (и реферер отсутствует),
    // то его нужно пропустить, что уже учтено выше `requestOrigin` проверкой.
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
