import * as babel from '@babel/core';
import path from 'path';

const testCases = [
  [
    // Examples from https://github.com/lukeed/clsx
    "clsx('foo', true && 'bar', 'baz');",
    "clsx('foo',true&&'bar','baz');",
  ],
  [
    "clsx({ foo:true }, { bar:false }, null, { '--foobar':'hello' });",
    "clsx(true&&foo,false&&bar,null,'hello'&&'--foobar');",
  ],
  // Snippets taken from https://github.com/mui-org/material-ui/tree/next/packages/material-ui/src
  [
    'clsx(childrenClassNameProp, childrenProp.props.className);',
    'clsx(childrenClassNameProp,childrenProp.props.className);',
  ],
  [
    'clsx(classes.root,classes.system,{[classes.colorDefault]: !img,},classNameProp)',
    'clsx(classes.root,classes.system,!img&&classes.colorDefault,classNameProp);',
  ],
  [
    'clsx(classes.root,{[classes.invisible]: invisible,},className)',
    'clsx(classes.root,invisible&&classes.invisible,className);',
  ],
  [
    'clsx(classes.child, {[classes.childLeaving]: leaving,[classes.childPulsate]: pulsate,})',
    'clsx(classes.child,leaving&&classes.childLeaving,pulsate&&classes.childPulsate);',
  ],
  [
    "clsx(classes.avatar, avatarProp.props.className, {[classes[`avatarColor${capitalize(color)}`]]: color !== 'default',})",
    "clsx(classes.avatar,avatarProp.props.className,color!=='default'&&classes[`avatarColor${capitalize(color)}`]);",
  ],
  [
    "clsx(classes.root,{[classes.extended]: variant === 'extended',[classes.primary]: color === 'primary',[classes.secondary]: color === 'secondary',[classes[`size${capitalize(size)}`]]: size !== 'large',[classes.disabled]: disabled,[classes.colorInherit]: color === 'inherit',},className,)",
    "clsx(classes.root,variant==='extended'&&classes.extended,color==='primary'&&classes.primary,color==='secondary'&&classes.secondary,size!=='large'&&classes[`size${capitalize(size)}`],disabled&&classes.disabled,color==='inherit'&&classes.colorInherit,className);",
  ],
  [
    "clsx(classes.bar, {[classes.barColorPrimary]: color === 'primary' && variant !== 'buffer',[classes.bar2Indeterminate]: variant === 'indeterminate' || variant === 'query',})",
    "clsx(classes.bar,color==='primary'&&variant!=='buffer'&&classes.barColorPrimary,(variant==='indeterminate'||variant==='query')&&classes.bar2Indeterminate);",
  ],
  [
    `clsx(classes.bar, {[classes.barColorPrimary]: color === 'primary' && variant !== 'buffer',[classes.colorPrimary]: color === 'primary' && variant === 'buffer',[classes.barColorSecondary]: color === 'secondary' && variant !== 'buffer',[classes.colorSecondary]: color === 'secondary' && variant === 'buffer',[classes.bar2Indeterminate]: variant === 'indeterminate' || variant === 'query',[classes.bar2Buffer]: variant === 'buffer',})`,
    `clsx(classes.bar,(variant==='indeterminate'||variant==='query')&&classes.bar2Indeterminate,variant==='buffer'&&[color==='primary'&&classes.colorPrimary,color==='secondary'&&classes.colorSecondary,classes.bar2Buffer],variant!=='buffer'&&[color==='primary'&&classes.barColorPrimary,color==='secondary'&&classes.barColorSecondary]);`,
  ],
  [
    "clsx({[classes.head]: variant ? variant === 'head' : tablelvl2 && tablelvl2.variant === 'head'});",
    "clsx((variant?variant==='head':tablelvl2&&tablelvl2.variant==='head')&&classes.head);",
  ],
  [
    `clsx(
      foo && classes.text,
      bar && classes.text,
      text && classes.text,
      color === "primary" && text && true && classes.text,
      text && color === "primary" && classes.textPrimary,
      text && color === "secondary" && classes.textSecondary
    );
    `,
    'clsx(color==="primary"&&[text&&[true&&classes.text,classes.textPrimary]],text&&[classes.text,color==="secondary"&&classes.textSecondary],foo&&classes.text,bar&&classes.text);',
  ],
  [
    `clsx(
      classes.root,
      {
        [classes.text]: text,
        [classes.textPrimary]: text && color === 'primary',
        [classes.textSecondary]: text && color === 'secondary',
        [classes.contained]: contained,
        [classes.containedPrimary]: contained && color === 'primary',
        [classes.containedSecondary]: contained && color === 'secondary',
        [classes.outlined]: variant === 'outlined',
        [classes.outlinedPrimary]: variant === 'outlined' && color === 'primary',
        [classes.outlinedSecondary]: variant === 'outlined' && color === 'secondary',
        [classes.disabled]: disabled,
        [classes.fullWidth]: fullWidth,
        [classes.colorInherit]: color === 'inherit',
      },
      classNameProp,
    );`,
    "clsx(classes.root,classNameProp,variant==='outlined'&&[classes.outlined,color==='primary'&&classes.outlinedPrimary,color==='secondary'&&classes.outlinedSecondary],color==='secondary'&&[text&&classes.textSecondary,contained&&classes.containedSecondary],color==='primary'&&[text&&classes.textPrimary,contained&&classes.containedPrimary],text&&classes.text,contained&&classes.contained,disabled&&classes.disabled,fullWidth&&classes.fullWidth,color==='inherit'&&classes.colorInherit);",
  ],
  [
    `clsx(
      classes.root,
      {
        [classes.selected]: selected,
        [classes.iconOnly]: !showLabel && !selected,
      },
      className,
    )`,
    'clsx(classes.root,selected&&classes.selected,!showLabel&&!selected&&classes.iconOnly,className);',
  ],
  [
    `clsx(
      classes.root,
      {
        [classes.disabled]: disabled,
        [classes.focusVisible]: this.state.focusVisible,
        [focusVisibleClassName]: this.state.focusVisible,
      },
      classNameProp,
    )`,
    'clsx(classes.root,classNameProp,this.state.focusVisible&&[classes.focusVisible,focusVisibleClassName],disabled&&classes.disabled);',
  ],
  [
    "clsx({[classes[`deleteIconColor${capitalize(color)}`]]:  color !== 'default' && variant !== 'outlined',[classes[`deleteIconOutlinedColor${capitalize(color)}`]]:  color !== 'default' && variant === 'outlined',})",
    "clsx(color!=='default'&&[variant!=='outlined'&&classes[`deleteIconColor${capitalize(color)}`],variant==='outlined'&&classes[`deleteIconOutlinedColor${capitalize(color)}`]]);",
  ],
  [
    "clsx(classes.root,{[classes[`color${capitalize(color)}`]]: color !== 'default',[classes.clickable]: clickable,[classes[`clickableColor${capitalize(color)}`]]: clickable && color !== 'default',[classes.deletable]: onDelete,[classes[`deletableColor${capitalize(color)}`]]: onDelete && color !== 'default',[classes.outlined]: variant === 'outlined',[classes.outlinedPrimary]: variant === 'outlined' && color === 'primary',[classes.outlinedSecondary]: variant === 'outlined' && color === 'secondary',},classNameProp);",
    "clsx(classes.root,classNameProp,variant==='outlined'&&[classes.outlined,color==='primary'&&classes.outlinedPrimary,color==='secondary'&&classes.outlinedSecondary],color!=='default'&&[classes[`color${capitalize(color)}`],clickable&&classes[`clickableColor${capitalize(color)}`],onDelete&&classes[`deletableColor${capitalize(color)}`]],clickable&&classes.clickable,onDelete&&classes.deletable);",
  ],
  ['clsx(a && b, c && d, e && f);', 'clsx(a&&b,c&&d,e&&f);'],
  [
    "clsx(true && true && 'foo', {[bar]:true && true, [baz]: false && true});",
    "clsx(true&&['foo',bar,false&&baz]);",
  ],
  [
    `clsx(
  classes.root,
  {
    [classes.head]: tablelvl2 && tablelvl2.variant === 'head',
    [classes.footer]: tablelvl2 && tablelvl2.variant === 'footer',
    [classes.hover]: hover,
    [classes.selected]: selected,
  },
  className,
)`,
    `clsx(classes.root,className,tablelvl2&&[tablelvl2.variant==='head'&&classes.head,tablelvl2.variant==='footer'&&classes.footer],hover&&classes.hover,selected&&classes.selected);`,
  ],
];

it('transforms objects correctly', () => {
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];

    const result = babel.transformSync(testCase[0], {
      plugins: [path.resolve(__dirname, '..')],
      babelrc: false,
      configFile: false,
      compact: true,
    });

    if (testCase.length !== 2) {
      throw new Error('Missing expected result. Output:\n' + result.code);
    } else {
      if (result.code !== testCase[1]) {
        console.log('Index of failed test: %d', i);
      }
      expect(result.code).toBe(testCase[1]);
    }
  }
});
