import {colors} from 'common/theme/colors';
import _ from 'lodash';
import React from 'react';
import {Path} from 'react-native-svg';
import {JoinPaths} from './ZigZagUtil';

export function NodeCurves(links) {
  const nodePath = _.map(links, function (d, i) {
    return (
      <Path
        key={'curves_' + i}
        d={JoinPaths(d)}
        fill="none"
        strokeWidth={3}
        stroke={colors.primary_003}
      />
    );
  });

  return nodePath;
}
