// netlify/edge-functions/check-referer-v2.js

// Экспортируем асинхронную функцию по умолчанию, которую Netlify будет вызывать
export default async (request, context) => {
  // Получаем значение заголовка 'referer' из входящего запроса
  const referer = request.headers.get('referer');
  // Получаем полный URL текущего запроса
  const requestUrl = request.url;

  // Логирование для отладки (эти сообщения вы увидите в логах Netlify Deploy)
  console.log('Incoming request URL:', requestUrl);
  console.log('Referer header:', referer);

  // Определяем список разрешённых доменов, с которых разрешён доступ
  // Включаем как ваш основной сайт на Tilda, так и домен вашего Netlify сайта
  // (чтобы он мог загружать свои собственные ресурсы - изображения, CSS и т.д.)
  const allowedReferers = [
    'https://pro-culinaria.ru',
    'http://pro-culinaria.ru', // Включено на случай, если кто-то зайдёт по http
    'https://www.pro-culinaria.ru',
    'http://www.pro-culinaria.ru', // Включено на случай, если кто-то зайдёт по http с www

    // !!! ВАЖНО !!!
    // Добавляем домен самого Netlify сайта.
    // Именно он будет реферером для запросов к вашим статическим файлам (изображениям, CSS),
    // когда страница загружается на Netlify.
    'https://pesto-book.netlify.app',
    'http://pesto-book.netlify.app', // Включено на случай, если сайт Netlify доступен по http
  ];

  // Дополнительная проверка: если запрос идёт к ресурсу, который находится на том же домене,
  // что и сама Edge Function (т.е., к вашим собственным файлам на pesto-book.netlify.app),
  // то его нужно пропустить без проверки Referer.
  // Это защищает от блокировки собственных статических файлов, если Referer отсутствует
  // или по каким-то причинам не соответствует.
  const requestOrigin = new URL(requestUrl).origin;
  if (allowedReferers.includes(requestOrigin)) {
      console.log('Request origin is allowed (self-access), skipping referer check.');
      return context.next(); // Пропускаем запрос
  }

  // Если заголовок Referer присутствует в запросе
  if (referer) {
    try {
      // Парсим Referer URL, чтобы получить только протокол и домен (origin)
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;

      console.log('Parsed Referer Origin:', refererOrigin);

      // Проверяем, находится ли полученный Origin в списке разрешённых
      const isAllowed = allowedReferers.includes(refererOrigin);

      console.log('Is referer allowed?', isAllowed);

      if (isAllowed) {
        // Если реферер разрешён, пропускаем запрос дальше
        return context.next();
      }
    } catch (e) {
      // Логируем ошибку, если Referer URL невалиден или произошла ошибка парсинга
      console.error("Invalid referer URL or parsing error:", referer, e);
    }
  } else {
    // Если заголовок Referer отсутствует (например, прямой заход)
    console.log('No referer header found.');
    // В этом случае запрос будет заблокирован, если он не был пропущен предыдущей проверкой requestOrigin.
    // Это стандартное поведение для блокировки прямого доступа или доступа без реферера,
    // что обычно является желаемым для защиты контента.
  }

  // Если ни одно из условий пропуска не сработало (реферер отсутствует или не разрешён),
  // блокируем доступ и возвращаем ошибку 403 Forbidden.
  console.log('Blocking request: Referer not allowed or missing.');
  return new Response('Access Denied: This page is only accessible from allowed sources.', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
