import PropTypes from 'prop-types';
import clsx from 'clsx';

function foo(props) {
  const { position: p, ...rest } = props;
  const x = clsx(
    p === 'top' && classes.x,
    p === 'bottom' && classes.y,
    rest.anchor === 'left' && classes.z,
    rest.anchor === 'right' && classes.a,
  );
}

foo.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom']),
  anchor: PropTypes.oneOf(['left', 'right']),
};
