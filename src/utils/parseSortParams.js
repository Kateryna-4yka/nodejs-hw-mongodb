import { SORT_ORDER } from "../constants/index.js";

const parseSortOrder = (sortOrder) => {
  if (typeof sortOrder === "undefined") {
    return "asc";
  }

  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder){return sortOrder;};

  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  if(typeof sortBy === "undefined") { return "name";}

  const keysOfContacts = [
    '_id',
    'name',
    'isFavourite',
    'contactType',
  ];

  if (!keysOfContacts.includes(sortBy)) {
    return "name";
  }

  return sortBy;
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
