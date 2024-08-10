import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Stack} from 'components/Stack';
import {TextView} from 'components/TextView';
import React from 'react';
import {StyleSheet} from 'react-native';
import {PersonaImage} from './components/PersonaImage';

interface AssigneeProps {
  data: AssigneeInterface[];
}

export type AssigneeInterface = {
  name?: string;
  profileUrl?: string;
};

export const AssigneeImage: React.FC<AssigneeProps> = ({data}) => {
  const truncatedArray = data
    ?.slice(0, 3)
    ?.filter(item => Object.keys(item)?.length !== 0);
  return (
    <Stack horizontal style={styles().container}>
      <PersonaImage data={truncatedArray} />
      {data?.length > 3 && (
        <Stack style={[styles().image, styles().persons]}>
          <TextView weight="regular" variant={FontSizes.xxSmall}>
            +{data?.length - 3}
          </TextView>
        </Stack>
      )}
    </Stack>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginTop: -4,
      right: 5,
      marginBottom: 10,
    },
    persons: {
      backgroundColor: colors.grey_008,
      justifyContent: 'center',
      paddingLeft: 3,
    },
    image: {
      height: 22,
      width: 22,
      borderRadius: 22,
      marginRight: -5,
      borderWidth: 1.5,
      borderColor: colors.grey_011,
    },
  });
  return mergeStyles;
};
