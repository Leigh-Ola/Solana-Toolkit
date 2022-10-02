const chalk = require('chalk');

const error = msg => console.log(chalk.white.bgRed.bold(msg));
const success = msg => console.log(chalk.green.bold(msg));
const info = msg => console.log(chalk.blue.bold(msg));
const infoWithArgument = (msg,...args) => console.log(chalk.rgb(123, 45, 67).bold(msg), ...args);

module.exports = {
  error,
  success,
  info,
  infoWithArgument
};
