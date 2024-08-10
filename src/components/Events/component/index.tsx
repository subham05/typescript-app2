import {Icon} from 'components/Icon';
import React from 'react';

interface PriorityTag {
  priority?: number;
  type?: string;
}
export const PriorityTag: React.FC<PriorityTag> = ({type}) => {
  return <Icon name="bookmark" size={24} color={type} />;
};
