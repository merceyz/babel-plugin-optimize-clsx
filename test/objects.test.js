import * as babel from '@babel/core';
import path from 'path';

const testCases = [
  // Examples from https://github.com/lukeed/clsx
  ["clsx('foo', true && 'bar', 'baz');", "clsx('foo',true&&'bar','baz');"],
  [
    "clsx({ foo:true }, { bar:false }, null, { '--foobar':'hello' });",
    "clsx(true&&foo,false&&bar,null,'hello'&&'--foobar');",
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
    "clsx(classes.bar, {[classes.barColorPrimary]: color === 'primary' && variant !== 'buffer',[classes.colorPrimary]: color === 'primary' && variant === 'buffer',[classes.barColorSecondary]: color === 'secondary' && variant !== 'buffer',[classes.colorSecondary]: color === 'secondary' && variant === 'buffer',[classes.bar2Indeterminate]: variant === 'indeterminate' || variant === 'query',[classes.bar2Buffer]: variant === 'buffer',})",
    "clsx(classes.bar,color==='primary'&&variant!=='buffer'&&classes.barColorPrimary,color==='primary'&&variant==='buffer'&&classes.colorPrimary,color==='secondary'&&variant!=='buffer'&&classes.barColorSecondary,color==='secondary'&&variant==='buffer'&&classes.colorSecondary,(variant==='indeterminate'||variant==='query')&&classes.bar2Indeterminate,variant==='buffer'&&classes.bar2Buffer);",
  ],
  [
    "clsx({[classes.head]: variant ? variant === 'head' : tablelvl2 && tablelvl2.variant === 'head'});",
    "clsx((variant?variant==='head':tablelvl2&&tablelvl2.variant==='head')&&classes.head);",
  ],
];

it('transforms objects correctly', () => {
  for (const testCase of testCases) {
    const result = babel.transformSync(testCase[0], {
      plugins: [path.resolve(__dirname, '..')],
      babelrc: false,
      configFile: false,
      compact: true,
    });

    if (testCase.length !== 2) {
      throw new Error('Missing expected result. Output:\n' + result.code);
    } else {
      expect(result.code).toBe(testCase[1]);
    }
  }
});
