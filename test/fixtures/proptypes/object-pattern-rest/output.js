import clsx from 'clsx/lite';
import PropTypes from 'prop-types';

function foo(props) {
	const { position: p, ...rest } = props;
	const x = clsx(
		p === 'top' ? classes.x : classes.y,
		rest.anchor === 'left' ? classes.z : classes.a
	);
}

foo.propTypes = {
	position: PropTypes.oneOf(['top', 'bottom']).isRequired,
	anchor: PropTypes.oneOf(['left', 'right']).isRequired,
};
