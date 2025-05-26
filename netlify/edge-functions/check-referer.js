export default async (request, context) => {
  const referer = request.headers.get('referer');
  const allowedReferers = [
    'https://pro-culinaria.ru', // Обратите внимание: без слеша в конце
    'https://pro-culinaria.ru/rulang' // Обратите внимание: без слеша в конце
    // Добавьте здесь любые другие разрешенные домены, если это необходимо
  ];

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      // Для сравнения берем только origin (домен и порт), чтобы избежать проблем со слешами в конце пути
      if (allowedReferers.includes(refererUrl.origin) || allowedReferers.includes(refererUrl.origin + refererUrl.pathname.replace(/\/$/, ''))) {
        return;
      }
    } catch (e) {
      // Если referer не является валидным URL, игнорируем ошибку и блокируем доступ
      console.error("Invalid referer URL:", referer, e);
    }
  }

  // Если реферер отсутствует, не является валидным URL или не в списке разрешенных, возвращаем 403 Forbidden
  return new Response('Доступ запрещен. Эта страница доступна только по ссылке с разрешенных источников.', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8', // Добавил charset=utf-8 для правильного отображения
    },
  });
};
