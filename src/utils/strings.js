import * as t from '@babel/types';
import template from '@babel/template';

export function isStringLike(node) {
  return t.isStringLiteral(node) || t.isTemplateLiteral(node);
}

export function combineStringLike(a, b) {
  if (isStringLikeEmpty(a) && isStringLikeEmpty(b)) {
    return t.stringLiteral('');
  }

  if (t.isStringLiteral(a) && t.isStringLiteral(b)) {
    return t.stringLiteral(a.value + ' ' + b.value);
  }

  if (t.isTemplateLiteral(a) && t.isTemplateLiteral(b)) {
    const expressions = [...a.expressions, ...b.expressions];
    const quasis = [...a.quasis];

    quasis[quasis.length - 1] = templateElement(
      quasis[quasis.length - 1].value.raw + ' ' + b.quasis[0].value.raw,
    );

    quasis.push(...b.quasis.slice(1));

    return templateOrStringLiteral(quasis, expressions);
  }

  if (t.isTemplateLiteral(a) && t.isStringLiteral(b)) {
    const expressions = [...a.expressions];
    const quasis = [...a.quasis];

    const i = quasis.length - 1;
    quasis[i] = templateElement(quasis[i].value.raw + ' ' + b.value, true);

    return templateOrStringLiteral(quasis, expressions);
  }

  if (t.isStringLiteral(a) && t.isTemplateLiteral(b)) {
    const expressions = [...b.expressions];
    const quasis = [...b.quasis];

    const i = 0;
    quasis[i] = templateElement(a.value + ' ' + quasis[i].value.raw, true);

    return templateOrStringLiteral(quasis, expressions);
  }

  throw new Error('Unable to handle that input');
}

export function isStringLikeEmpty(node) {
  if (t.isStringLiteral(node)) {
    return node.value.length === 0;
  }

  if (t.isTemplateLiteral(node)) {
    return node.expressions.length === 0 && node.quasis.every(q => q.value.raw.length === 0);
  }

  return false;
}

function templateOrStringLiteral(quasis, expressions) {
  if (expressions.length === 0) {
    return t.stringLiteral(quasis[0].value.raw);
  }

  return t.templateLiteral(quasis, expressions);
}

function templateElement(value, tail = false) {
  // Workaround to get the cooked value
  // https://github.com/babel/babel/issues/9242
  const valueAST = template.ast(`\`${value}\``).expression.quasis[0].value;

  return t.templateElement(valueAST, tail);
}
