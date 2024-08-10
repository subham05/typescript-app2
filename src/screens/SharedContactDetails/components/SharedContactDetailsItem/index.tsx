import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {sharedUserModal} from 'screens/CreateContact/types';
import {Styles} from './index.styles';

interface SharedContactDetailsItemProps {
  item: sharedUserModal;
}

export interface SharedContactDetailsProps {
  name: string;
  number: string;
}

export const SharedContactDetailsItem: React.FC<
  SharedContactDetailsItemProps
> = ({item}) => {
  const {name, profileUrl, mobile} = item;
  const styles = Styles();
  return (
    <Stack style={styles.container}>
      <Stack horizontal horizontalAlign="space-between">
        <StackItem childrenGap={10} horizontal>
          <Stack>
            <Persona name={name || ''} image={profileUrl || ''} size={50} />
          </Stack>
          <Stack style={styles.view}>
            <TextView weight="medium" variant={FontSizes.medium} truncate>
              {name || ''}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles.number}>
              {mobile || ''}
            </TextView>
          </Stack>
        </StackItem>
      </Stack>
      <Stack style={styles.listDivider}>
        <Divider />
      </Stack>
    </Stack>
  );
};
