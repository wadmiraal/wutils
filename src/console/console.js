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

module.exports = {
  echo,
  error,
  info,
  success,
  warn,
};
