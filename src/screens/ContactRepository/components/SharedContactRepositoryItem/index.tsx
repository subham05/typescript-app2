import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {shareContactData} from 'screens/CreateContact/types';
// import Share_filled from '../../../../assets/svgs/share_filled.svg';
import {Styles} from './index.styles';

interface SharedContactRepositoryItemProps {
  item: shareContactData;
  SharedContactDetails: (id?: string) => void;
}

export const SharedContactRepositoryItem: React.FC<
  SharedContactRepositoryItemProps
> = ({item, SharedContactDetails}) => {
  const styles = Styles();
  const {contactName, contactPhone, _id, contactProfile} = item;
  return (
    <Stack>
      <TouchableOpacity
        onPress={() => SharedContactDetails?.(_id)}
        style={styles.container}>
        <Stack horizontal horizontalAlign="space-between">
          <StackItem childrenGap={10} horizontal>
            <Stack>
              <Persona name={contactName} image={contactProfile} />
              {/* <Share_filled height={22} width={22} style={styles.iconImage} /> */}
              {/* <Icon
                name="share_filled"
                size={22}
                color={colors.primary_007}
                style={styles.iconImage}
              /> */}
            </Stack>
            <Stack style={styles.view}>
              <TextView weight="medium" variant={FontSizes.medium} truncate>
                {contactName || ''}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.number}>
                {contactPhone || ''}
              </TextView>
            </Stack>
          </StackItem>
        </Stack>
      </TouchableOpacity>
      <View style={styles.viewDivide} />
    </Stack>
  );
};
