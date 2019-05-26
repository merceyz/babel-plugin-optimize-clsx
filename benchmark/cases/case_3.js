const clsx = require('clsx');

module.exports = [
  'String literals',
  () => {
    return clsx({
      btn: true,
      'col-md-1': true,
      ['btn-primary']: true,
    });
  },
  () => {
    return 'btn col-md-1 btn-primary';
  },
];
