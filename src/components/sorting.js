import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;

    // Если пользователь кликнул на колонку для сортировки
    if (action && action.name === "sort") {
      // Переключаем режим сортировки (asc → desc → none)
      action.dataset.value = sortMap[action.dataset.value];

      // Запоминаем поле и порядок
      field = action.dataset.field;
      order = action.dataset.value;

      // Сбрасываем сортировку на других колонках
      columns.forEach((column) => {
        if (column.dataset.field !== field) {
          column.dataset.value = "none";
        }
      });
    } else {
      // Если сортировка уже активна — восстанавливаем её
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    // Добавляем параметр сортировки в query (если активна)
    const sort = field && order !== "none" ? `${field}:${order}` : null;

    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
