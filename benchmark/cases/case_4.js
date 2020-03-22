const isDisabled = true;

module.exports = {
	title: 'Unnecessary function calls',
	before(clsx) {
		return clsx({
			btn: true,
			'btn-foo': isDisabled,
			'btn-bar': !isDisabled,
		});
	},
	after() {
		return 'btn ' + (isDisabled ? 'btn-foo' : 'btn-bar');
	},
};
