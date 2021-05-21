import React from 'react';
import { GenX } from '../';
import props from '../../demo/src/props.json'

export default {
  title: 'GenX',
  component: GenX,
};

export const Debug = () => <GenX {...props} />;
