const set = (key, value, object = {}) => {
  if (key.includes(".")) {
    const keys = key.split(".");
    const currentKey = keys[0];
    const newKey = keys.slice(1).join(".");
    object[currentKey] = set(
      newKey,
      value,
      object[currentKey] ? object[currentKey] : {}
    );
  } else {
    object[key] = value;
  }
  if (isNumericOnly(object)) {
    return convertToArray(object);
  } else {
    return object;
  }
};

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function isNumericOnly(object) {
  let numericOnly = true;
  const keys = Object.keys(object);
  keys.map((key) => {
    if (!isNumeric(key) && numericOnly) {
      numericOnly = false;
    }
  });

  return numericOnly;
}

function convertToArray(object) {
  const keys = Object.keys(object);
  const newArray = keys.map((key) => {
    return object[key];
  });
  return newArray;
}

const sanitize = (object) => {
  Object.entries(object).forEach(([k, v]) => {
    if (v && typeof v === "object") {
      sanitize(v);
    }
    if (v === null || v === undefined) {
      if (Array.isArray(object)) {
        object.splice(k, 1);
      } else {
        delete object[k];
      }
    }
  });
  return object;
};

const copy = (object) => {
  return JSON.parse(JSON.stringify(object));
};

export default {
  set,
  sanitize,
  copy,
};
