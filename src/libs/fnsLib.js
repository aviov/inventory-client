const compareByDateCreatedAt = (a, b) => {
  if (a.dateCreatedAt < b.dateCreatedAt) { return 1 }
  if (a.dateCreatedAt > b.dateCreatedAt) { return -1 }
  return 0;
};

export const getSortedByDateCreatedAt = (arrayOfObjects=[]) => {
  return arrayOfObjects.slice().sort((a, b) => compareByDateCreatedAt(a, b));
};

// for past descending
const compareDescendingByDateActionStart = (a, b) => {
  if (a.dateActionStart < b.dateActionStart) { return 1 }
  if (a.dateActionStart > b.dateActionStart) { return -1 }
  return 0;
};

const getPastActionsByDateActionStart = (arrayOfObjects=[]) => {
  return arrayOfObjects.filter(({ dateActionStart }) =>
    dateActionStart <= new Date().toISOString());
};

export const getSortedDescendingByDateActionStart = (arrayOfObjects=[]) => {
  return arrayOfObjects.slice().sort((a, b) =>
    compareDescendingByDateActionStart(a, b));
};

export const getLatestPastActionByDateActionStart = (arrayOfObjects=[]) => {
  return getSortedDescendingByDateActionStart(getPastActionsByDateActionStart(arrayOfObjects))[0];
};

// for future ascending
const compareAscendingByDateActionStart = (a, b) => {
  if (a.dateActionStart > b.dateActionStart) { return 1 }
  if (a.dateActionStart < b.dateActionStart) { return -1 }
  return 0;
};

const getFutureActionsByDateActionStart = (arrayOfObjects=[]) => {
  return arrayOfObjects.filter(({ dateActionStart }) =>
    dateActionStart > new Date().toISOString());
};

const getSortedAscendingByDateActionStart = (arrayOfObjects=[]) => {
  return arrayOfObjects.slice().sort((a, b) =>
    compareAscendingByDateActionStart(a, b));
};

export const getEarliestFutureActionByDateActionStart = (arrayOfObjects=[]) => {
  return getSortedAscendingByDateActionStart(getFutureActionsByDateActionStart(arrayOfObjects))[0];
};

export const sliceStringFrom = (str, start) =>
  (((typeof str) === 'string') && !str.startsWith(start)) ?
  str.slice(str.indexOf(start)) :
  str;

export const getIsDisabledVisibleLatest = (actionTypes=[]) => (
  actionTypes.filter(({ isVisibleLatest }) =>
    (isVisibleLatest === true)).length > 0
);

export const getIsDisabledVisibleNext = (actionTypes=[]) => (
  actionTypes.filter(({ isVisibleNext }) =>
    (isVisibleNext === true)).length > 0
);

// compare dates
export const isDateToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
};

export const isDateFuture = (date) => {
  const today = new Date();
  return (new Date(today.toDateString()) < new Date(date.toDateString()));
};

export const isDatePast = (date) => {
  const today = new Date();
  return (new Date(today.toDateString()) > new Date(date.toDateString()));
};