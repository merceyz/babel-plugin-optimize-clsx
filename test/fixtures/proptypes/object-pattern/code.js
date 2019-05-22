import PropTypes from 'prop-types';
import clsx from 'clsx';

function foo(props) {
  const { position: p } = props;
  const x = clsx(p === 'top' && classes.x, p === 'bottom' && classes.y);
}

foo.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom']),
};
