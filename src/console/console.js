/**
 * Prints the passed text and modifier to the console.
 *
 * For internal use only. Makes sure the modifiers are reset at the end of the
 * printed text.
 *
 * @param {String} modifier
 * @param {...String} text
 */
function print(modifier, ...text) {
  console.log(`${modifier}${text.join(" ")}\x1b[0m`);
}

function echo(...text) {
  console.log(...text);
}

function error(...text) {
  print("\x1b[31m", ...text);
}

function info(...text) {
  print("\x1b[34m", ...text);
}

function success(...text) {
  print("\x1b[32m", ...text);
}

function warn(...text) {
  print("\x1b[33m", ...text);
}

function nl() {
  console.log();
}

module.exports = {
  echo,
  error,
  info,
  nl,
  success,
  warn,
};
