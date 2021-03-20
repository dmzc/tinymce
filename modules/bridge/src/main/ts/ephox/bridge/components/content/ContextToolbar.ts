import { FieldSchema, ValueSchema } from '@ephox/boulder';
import { Cell, Optional, Result } from '@ephox/katamari';
import { ContextBar, contextBarFields, ContextBarSpec } from './ContextBar';

export interface ContextToolbarSpec extends ContextBarSpec {
  type?: 'contexttoolbar';
  items: string;
}

export interface ContextToolbar extends ContextBar {
  type: 'contexttoolbar';
  items: string;
}

const contextToolbarSchema = ValueSchema.objOf([
  FieldSchema.defaulted('type', 'contexttoolbar'),
  FieldSchema.strictString('items'),
  FieldSchema.state('activeGroup', () => Cell(Optional.none()))
].concat(contextBarFields));

export const createContextToolbar = (spec: ContextToolbarSpec): Result<ContextToolbar, ValueSchema.SchemaError<any>> =>
  ValueSchema.asRaw<ContextToolbar>('ContextToolbar', contextToolbarSchema, spec);
