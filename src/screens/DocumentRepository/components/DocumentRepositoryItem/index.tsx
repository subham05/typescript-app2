import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {docInterface} from 'request/DocumentRepository';
import Text_snippet from '../../../../assets/svgs/text_snippet.svg';
import Share_doc from '../../../../assets/svgs/share.svg';
import {toConvertKB} from 'common/utils/permission/common';

interface DocumentRepositoryItemProps {
  data: docInterface;
  onPress: () => void;
  isShareWithMeTab?: boolean;
}

export interface DocumentRepositoryProps {
  name: string;
  title: string;
  date: string;
  size: string;
}

export const DocumentRepositoryItem: React.FC<DocumentRepositoryItemProps> = ({
  data,
  onPress,
  isShareWithMeTab,
}) => {
  const {title, size, date, time, documentSharedWith, userName} = data;
  return (
    <>
      <TouchableOpacity style={styles().container} onPress={() => onPress()}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            {/* <Icon
            name="text_snippet"
            size={18}
            color={colors.primary}
            style={styles().fileIcon}
          /> */}
            <Stack style={styles().fileIcon}>
              <Text_snippet width={20} height={20} style={styles().docIcon} />
              {!isShareWithMeTab && documentSharedWith?.length > 0 && (
                <View style={styles().shareIconStyle}>
                  <Share_doc width={15} height={15} />
                </View>
              )}
            </Stack>
            <Stack style={styles().view}>
              <StackItem childrenGap={5} horizontal verticalAlign="center">
                <TextView weight="medium" variant={FontSizes.medium} truncate>
                  {title || ''}
                </TextView>
                {size && (
                  <TextView
                    weight="regular"
                    variant={FontSizes.small}
                    style={styles().text}>
                    {toConvertKB(size) || ''}
                  </TextView>
                )}
              </StackItem>
              <Stack horizontal verticalAlign="center">
                {/* <Icon
                  name="calendar"
                  size={18}
                  color={colors.primary_003}
                  style={styles().calendar}
                /> */}
                {/* <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles().text}>
                  {data.name} {' | '}
                </TextView> */}
                {userName && (
                  <TextView
                    weight="regular"
                    variant={FontSizes.small}
                    style={styles().text}>
                    {userName} |{' '}
                  </TextView>
                )}
                <TextView
                  weight="regular"
                  variant={FontSizes.small}
                  style={styles().text}>
                  {date || ''};{time || ''}
                </TextView>
              </Stack>
            </Stack>
          </Stack>
          <Icon
            name="arrow_right"
            size={18}
            color={colors.primary}
            style={styles().arrowIcon}
          />
        </Stack>
      </TouchableOpacity>
      <Divider />
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 3,
    },
    fileIcon: {
      alignSelf: 'center',
      marginRight: 15,
    },
    view: {
      marginLeft: 10,
      marginTop: 3,
      width: '80%',
    },
    icon: {
      justifyContent: 'center',
    },
    calendar: {
      marginRight: 5,
    },
    text: {
      color: colors.grey_003,
    },
    arrowIcon: {
      alignSelf: 'center',
    },
    shareIconStyle: {
      width: 20,
      height: 20,
      position: 'absolute',
      left: 11,
      top: 11,
      padding: 3,
      backgroundColor: colors.white,
      borderRadius: 10,
    },
    docIcon: {position: 'relative'},
  });
  return mergeStyles;
};
