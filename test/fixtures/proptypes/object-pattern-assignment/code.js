import PropTypes from 'prop-types';
import clsx from 'clsx';

function foo(props) {
	const { position = 'top', anchor: a = 'left' } = props;
	const x = clsx(
		position === 'top' && classes.x,
		position === 'bottom' && classes.y,
		a === 'left' && classes.z,
		a === 'right' && classes.anchor
	);
}

foo.propTypes = {
	position: PropTypes.oneOf(['top', 'bottom']),
	anchor: PropTypes.oneOf(['left', 'right']),
};
