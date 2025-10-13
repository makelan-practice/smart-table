export function initFiltering(elements) {
  /**
   * Обновление списка доступных индексов
   * @param {Object} elements — элементы фильтра
   * @param {Object} indexes — данные индексов с сервера
   */
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      const el = elements[elementName];
      if (!el) return;

      el.append(
        ...Object.values(indexes[elementName]).map((name) => {
          const option = document.createElement("option");
          option.textContent = name;
          option.value = name;
          return option;
        })
      );
    });
  };

  /**
   * @param {Object} query — текущий запрос
   * @param {Object} state — состояние формы
   * @param {HTMLButtonElement?} action — действие
   */
  const applyFiltering = (query, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const field = action.dataset.field;

      const wrapper = action.closest(".filter-wrapper");
      const input = wrapper?.querySelector(
        "input[data-name='searchByDate'], input[name='" + field + "']"
      );

      if (input) {
        input.value = ""; // очищаем текстовое поле
        if (state) state[field] = ""; // обновляем состояние
      }

      if (query[`filter[${field}]`]) {
        delete query[`filter[${field}]`];
      }

      return query; // возвращаем обновлённый query
    }

    // @todo: #4.5 — собрать поля фильтра в объект filter
    const filter = {};
    Object.keys(elements).forEach((key) => {
      const el = elements[key];
      if (
        el &&
        ["INPUT", "SELECT"].includes(el.tagName) &&
        el.value &&
        el.value.trim() !== ""
      ) {
        filter[`filter[${el.name}]`] = el.value;
      }
    });

    // Если фильтры есть — добавляем их в query
    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
