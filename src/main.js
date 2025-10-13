import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные, используемые в render()
const api = initData(sourceData);

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
async function render(action) {
  const state = collectState();
  let query = {};

  // применяем поиск
  query = applySearching(query, state, action);

  // применяем фильтрацию
  query = applyFiltering(query, state, action);

  // применяем сортировку
  query = applySorting(query, state, action);

  // применяем пагинацию
  query = applyPagination(query, state, action);

  // запрос к API (кэш внутри getRecords)
  const { total, items } = await api.getRecords(query);

  updatePagination(total, query);

  // рендер таблицы
  sampleTable.render(items);
}

// Инициализация таблицы
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"], // шаблон заголовка таблицы
    after: ["pagination"], // шаблон пагинации
  },
  render
);

// Инициализация поиска
const applySearching = initSearching("search");

const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);

// Инициализация сортировки (после создания таблицы)
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const { applyPagination, updatePagination } = initPagination(
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

async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

init().then(render);
