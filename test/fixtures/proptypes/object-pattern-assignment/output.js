import clsx from 'clsx/lite';
import PropTypes from 'prop-types';

function foo(props) {
	const { position = 'top', anchor: a = 'left' } = props;
	const x = clsx(
		position === 'top' ? classes.x : classes.y,
		a === 'left' ? classes.z : classes.anchor
	);
}

foo.propTypes = {
	position: PropTypes.oneOf(['top', 'bottom']),
	anchor: PropTypes.oneOf(['left', 'right']),
};
