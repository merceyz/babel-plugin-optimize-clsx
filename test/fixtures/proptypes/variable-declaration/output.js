import PropTypes from 'prop-types';
import clsx from 'clsx';

function foo(props) {
	const p = props.position;
	const x = clsx(p === 'top' ? classes.x : classes.y);
}

foo.propTypes = {
	position: PropTypes.oneOf(['top', 'bottom']).isRequired,
};
