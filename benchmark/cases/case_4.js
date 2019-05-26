const clsx = require('clsx');

const isDisabled = true;

module.exports = [
  'Unnecessary function calls',
  () => {
    return clsx({
      btn: true,
      'btn-foo': isDisabled,
      'btn-bar': !isDisabled,
    });
  },
  () => {
    return 'btn ' + (isDisabled ? 'btn-foo' : 'btn-bar');
  },
];
