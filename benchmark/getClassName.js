// Simulates minimized className values from jss

let count = 0;
module.exports = () => {
  return `jss${String(count++)}`;
};
