const {
  isEmpty,
  isString,
  has,
  isArray,
  toLower,
  forEach,
  chunk,
  reduce,
  capitalize,
} = require('lodash');
const { isGenericValueEmpty } = require('./generic-validation');

function getValueByKeyFromArray(fieldName, key, keyFieldName, arr) {
  let fieldValue = null;

  const fieldElt = arr.filter((elt) => elt[keyFieldName] === key);

  if (!isEmpty(fieldElt)) {
    fieldValue = fieldElt[0][fieldName];
  }

  return fieldValue;
}

function isLastIndex(index, array) {
  return index === array.length - 1;
}

/**
 * This function will return only the first occurance of a value in an array.
 * This callback should be passed to array.filter().
 */
function onlyUniqueValues(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * This function will return only the first occurance of a object key value in an array.
 * This callback should be passed to array.filter().
 */
function onlyUniqueObjects(value, index, mainArray, key) {
  return mainArray.findIndex((obj) => value[key] === obj[key]) === index;
}

const getAllValuesAtPropertyInArray = (array, property) =>
  array.reduce(
    (accumulator, currentValue) =>
      currentValue?.[property] ? [...accumulator, currentValue[property]] : accumulator,
    [],
  );

const combineArrays = (arrays) => [].concat(...arrays);

const getLastIndex = (array) => {
  const length = array == null ? 0 : array.length;

  return length ? array[length - 1] : undefined;
};

// Sorts the array itself sent in the params
/**
 *
 * @param {*} array - data
 * @param {Object} orderByKeys -- the order of the keys listed matters
 * @param {string} orderByKeys.key - property name to sort by
 * @param {(1|-1)} orderByKeys.order - sort order: 1 for ASC | -1 for DESC
 * @param {'DATE'} orderByKeys.type - (optional)
 */
const sortArrayByKeysByOrder = (array, orderByKeys) => {
  orderByKeys.forEach(({ key, order, type }) => {
    if (type === 'DATE') {
      array.sort((a, b) => order * (new Date(a[key]) - new Date(b[key])));
    } else {
      array.sort((a, b) => order * (a[key] - b[key]));
    }
  });
};

// create an async forEach
// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
};

const asyncSome = async (array, predicate) => {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (await predicate(array[index])) {
      return true;
    }
  }

  return false;
};

const transformFieldsToLowerCase = (array, fieldNames) => {
  if (!isArray(array) || !isArray(fieldNames)) {
    return false;
  }

  const transformedArray = array.map((obj) => {
    const transformedObj = { ...obj };

    forEach(fieldNames, (fieldName) => {
      if (has(obj, fieldName) && isString(obj[fieldName])) {
        transformedObj[fieldName] = toLower(transformedObj[fieldName]);
      }
    });

    return transformedObj;
  });

  return transformedArray;
};

const chunkAndTransformArray = (arr, nameKey = 'name', valueKey = 'value') => {
  const chunkedArray = chunk(arr, 2);

  return chunkedArray.map((pair) =>
    reduce(
      pair,
      (acc, elem, elemIndex) => {
        const newKey = elemIndex === 0 ? 'first' : 'second';
        return {
          ...acc,
          [`${newKey}${capitalize(nameKey)}`]: elem[nameKey],
          [`${newKey}${capitalize(valueKey)}`]: elem[valueKey],
        };
      },
      {},
    ),
  );
};

const compareObjects = (elt1, elt2, { keysToCheck = [], nestedKeysToCheck = [] }) => {
  const objectsCompared = Object.keys(elt1).every((key) => {
    if (!keysToCheck.includes(key)) {
      return true;
    }

    if (isGenericValueEmpty(elt2[key])) {
      return false;
    }

    if (typeof elt1[key] === 'string' && typeof elt2[key] === 'string') {
      return !elt1[key].localeCompare(elt2[key], undefined, { sensitivity: 'base' });
    }

    if (typeof elt1[key] === 'object' && typeof elt2[key] === 'object') {
      return compareObjects(elt1[key], elt2[key], { keysToCheck: nestedKeysToCheck });
    }

    return elt1[key] === elt2[key];
  });

  return objectsCompared;
};

/**
 *
 * @param {*} array1 -- array to match
 * @param {*} array2 -- array matching against
 * @param {Object} options -- keys to check when comparing arrays
 * @param {String[]} options.directKeysToCheck -- direct keys to check when comparing arrays
 * @param {String[]} options.nestedKeysToCheck -- nested keys to check when comparing arrays
 * This is implemented for array of objects only which should include the property `id`
 * Returns an object { matchFound: { '2': 3 }, noMatchesFound: [ 1 ] }
 * * matchFound represents the id (2) from array1 matching the id (3) from array 2
 * * noMatchesFound includes all ids from array 1 where no match was found in array 2
 */
const findMatchingElementsInArrays = (
  array1,
  array2,
  { directKeysToCheck = [], nestedKeysToCheck = [] },
) => {
  const arraysCompared = array1.reduce(
    (accumulator, elt1) => {
      let currentArray2Elt;

      const eltFound = array2.some((elt2) => {
        currentArray2Elt = elt2;
        return compareObjects(elt1, elt2, { keysToCheck: directKeysToCheck, nestedKeysToCheck });
      });

      if (eltFound) {
        accumulator.matchFound[elt1.id] = currentArray2Elt.id;
      } else {
        accumulator.noMatchesFound.push(elt1.id);
      }

      return accumulator;
    },
    { matchFound: {}, noMatchesFound: [] },
  );

  return arraysCompared;
};

const updatePropertyInArrayOfObjects = (array, property, value) => {
  if (isEmpty(array)) return [];

  const result = array.map((item) => {
    if (item[property] !== value) {
      return {
        ...item,
        [property]: value,
      };
    }
    return item;
  });

  return result;
};

module.exports = {
  asyncSome,
  findMatchingElementsInArrays,
  getValueByKeyFromArray,
  isLastIndex,
  onlyUniqueValues,
  onlyUniqueObjects,
  combineArrays,
  getAllValuesAtPropertyInArray,
  getLastIndex,
  sortArrayByKeysByOrder,
  asyncForEach,
  transformFieldsToLowerCase,
  chunkAndTransformArray,
  updatePropertyInArrayOfObjects,
};
