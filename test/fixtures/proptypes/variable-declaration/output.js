import clsx from 'clsx/lite';
import PropTypes from 'prop-types';

function foo(props) {
	const p = props.position;
	const x = clsx(p === 'top' ? classes.x : classes.y);
}

foo.propTypes = {
	position: PropTypes.oneOf(['top', 'bottom']).isRequired,
};
