export function initSearching(searchField) {
  return (query, state, action) => {
    const value = state[searchField]?.trim();
    return value ? Object.assign({}, query, { search: value }) : query;
  };
}
