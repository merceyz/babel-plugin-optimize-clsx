import * as babel from '@babel/core';
import * as t from '@babel/types';
import { PluginOptions } from './options';

export type VisitorFunction = (params: {
  program: babel.NodePath<t.Program>;
  expression: babel.NodePath<t.CallExpression>;
  options: PluginOptions;
  state: Map<string, any>;
  filename: string;
}) => void;
