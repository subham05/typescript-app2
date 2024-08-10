import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import React from 'react';
import {FlatList, ScrollView} from 'react-native';
import {Styles} from '../../index.styles';

interface AttachmentTaskBodyProps {
  data: any;
}
export const AttachmentTaskBody: React.FC<AttachmentTaskBodyProps> = ({
  data,
}) => {
  const styles = Styles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.openBox}>
      <FlatList
        numColumns={data.length / 2}
        data={data}
        renderItem={({item}) => {
          return (
            <Stack horizontal style={styles.attachmentView}>
              <Stack horizontal style={{backgroundColor: colors.grey_009}}>
                <Stack horizontal style={styles.attachment}>
                  <Icon
                    name="photo_gallary"
                    size={18}
                    style={styles.attachmentIcon}
                    color={colors.black}
                  />
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.attachmentName}>
                    {item.name}
                  </TextView>
                </Stack>
                <Icon
                  name="download"
                  size={18}
                  color={colors.black}
                  style={styles.downloadIcon}
                />
              </Stack>
            </Stack>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
        style={styles.flatList}
      />
    </ScrollView>
  );
};
