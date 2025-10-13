import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  // шаблон для кнопки страницы
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  // переменная для хранения общего количества страниц
  let pageCount;

  // функция формирования параметров запроса
  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // обработка действий пагинации (перелистывание)
    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount ?? page + 1, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          // используем сохранённое pageCount
          page = pageCount || 1;
          break;
      }
    }

    // возвращаем новый объект query с параметрами пагинации
    return Object.assign({}, query, { limit, page });
  };

  // функция обновления отображения пагинатора после получения данных
  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    // список видимых страниц
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      })
    );

    // обновляем статусы
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };

  // возвращаем обе функции
  return {
    applyPagination,
    updatePagination,
  };
};
