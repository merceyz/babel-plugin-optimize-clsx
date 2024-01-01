import clsx from 'clsx/lite';
import PropTypes from 'prop-types';

function foo(props) {
	const x = clsx(props.position === 'top' ? classes.x : classes.y);
}

foo.propTypes = {
	position: PropTypes.oneOf(['top', 'bottom']).isRequired,
};
