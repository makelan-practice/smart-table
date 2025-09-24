import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";

// Исходные данные, используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let result = [...data]; // копируем данные для изменения

  // Применяем сортировку
  result = applySorting(result, state, action);

  // Применяем пагинацию
  result = applyPagination(result, state, action);

  // Отображаем результат в таблице
  sampleTable.render(result);
}

// Инициализация таблицы
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["header"], // шаблон заголовка таблицы
    after: ["pagination"], // шаблон пагинации
  },
  render
);

// Инициализация сортировки (после создания таблицы)
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// Инициализация пагинации (после создания таблицы)
const applyPagination = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

// Добавляем таблицу в DOM
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

// Первоначальный рендер
render();
