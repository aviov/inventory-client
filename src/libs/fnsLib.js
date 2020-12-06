export const compareByDateCreatedAt = (a, b) => {
  if (a.dateCreatedAt < b.dateCreatedAt) { return 1 }
  if (a.dateCreatedAt > b.dateCreatedAt) { return -1 }
  return 0;
};

export const getSortedByDateCreatedAt = (arrayOfObjects=[]) => {
  return arrayOfObjects.slice().sort((a, b) => compareByDateCreatedAt(a, b));
};

export const getLatestByDateCreatedAt = (arrayOfObjects=[]) => {
  return getSortedByDateCreatedAt(arrayOfObjects)[0];
};
