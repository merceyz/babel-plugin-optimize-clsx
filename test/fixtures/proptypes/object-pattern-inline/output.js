import clsx from 'clsx/lite';
import PropTypes from 'prop-types';

function foo({ position: p }) {
	const x = clsx(p === 'top' ? classes.x : classes.y);
}

foo.propTypes = {
	position: PropTypes.oneOf(['top', 'bottom']).isRequired,
};
