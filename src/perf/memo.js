function compareArgs(args1, args2) {
  if (args1.length !== args2.length) {
    return false;
  } else {
    for (let i = 0, len = args1.length; i < len; i++) {
      switch (typeof args1[i]) {
        case "string":
        case "number":
        case "boolean":
          if (args1[i] !== args2[i]) {
            return false;
          }
          break;
        default:
          if (!Object.is(args1[i], args2[i])) {
            return false;
          }
          break;
      }
    }
    return true;
  }
}

function memo(fn) {
  const cache = [];
  return function (...args) {
    const found = cache.find((c) => compareArgs(c.args, args));
    if (!found) {
      const result = fn.apply(null, args);
      cache.push({ args, result });
      return result;
    } else {
      return found.result;
    }
  };
}

module.exports = {
  memo,
};
