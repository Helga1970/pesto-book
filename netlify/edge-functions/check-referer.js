export default async (request, context) => {
  const referer = request.headers.get('referer');
  const allowedReferers = [
    'https://pro-culinaria.ru', // Без слеша в конце
    'https://pro-culinaria.ru/rulang' // Без слеша в конце
  ];

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      // Проверяем, соответствует ли реферер одному из разрешенных
      // Сравниваем origin (домен) ИЛИ origin + pathname без конечного слеша
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
      'Content-Type': 'text/plain; charset=utf-8', // Убедитесь, что здесь есть charset=utf-8
    },
  });
};
