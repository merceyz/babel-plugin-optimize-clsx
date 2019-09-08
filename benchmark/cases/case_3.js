module.exports = {
  title: 'Object with string literals',
  before(clsx) {
    return clsx({
      btn: true,
      'col-md-1': true,
      ['btn-primary']: true,
    });
  },
  after() {
    return 'btn col-md-1 btn-primary';
  },
};
