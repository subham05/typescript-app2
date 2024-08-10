import {colors} from 'common/theme/colors';
import _ from 'lodash';
import React from 'react';
import {Path} from 'react-native-svg';
import {sblingLine} from './siblingUtil';

export function SiblingCurves(siblings, allNodes) {
  const siblingJoins = _.map(siblings, function (d, i) {
    return (
      <Path
        key={'curves_' + i}
        d={sblingLine(d, allNodes)}
        fill={'none'}
        stroke={colors.primary_003}
        strokeWidth={3}
      />
    );
  });

  return siblingJoins;
}
