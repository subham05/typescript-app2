import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Divider} from 'components/Divider';
import {Stack, StackItem} from 'components/Stack';
import {TextView} from 'components/TextView';
import React, {useEffect, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {MailMessageItem} from '../MailMessageItem';
import {emailDetailDataModal} from 'request/Inbox/constants';

interface MailMessageListViewProps {
  data: emailDetailDataModal[];
  onPressCreateTask: () => void;
  onPressRelatedTask: () => void;
}
export const MailMessageListView: React.FC<MailMessageListViewProps> = ({
  data,
  onPressCreateTask,
  onPressRelatedTask,
}) => {
  let dataLength = data.length;

  const [showCount, setShowCount] = useState<boolean>(false);

  const lessMessagesStyle: StyleProp<ViewStyle> = {
    paddingBottom: showCount ? 0 : 0,
  };

  useEffect(() => {
    setShowCount(dataLength <= 3 ? false : true);
  }, [dataLength]);

  return (
    <>
      {!showCount ? (
        <View>
          {data.map((item, index) => {
            return (
              <View key={index} style={[styles().container, lessMessagesStyle]}>
                <Stack spaceBelow={showCount ? 100 : 15}>
                  <MailMessageItem
                    data={item}
                    key={index}
                    onPressCreateTask={onPressCreateTask}
                    onPressRelatedTask={onPressRelatedTask}
                    dataLength={dataLength}
                    opened={index === dataLength - 1 ? true : false}
                  />
                </Stack>
                {/* <Divider size={1} color={colors.grey_008} /> */}
              </View>
            );
          })}
        </View>
      ) : (
        <StackItem childrenGap={15}>
          <View style={[styles().paddingHorizontal]}>
            <MailMessageItem
              data={data[0]}
              onPressCreateTask={onPressCreateTask}
              onPressRelatedTask={onPressRelatedTask}
              dataLength={dataLength}
            />
          </View>
          <Stack style={styles().countView}>
            <StackItem childrenGap={4}>
              <Divider size={1} color={colors.grey_008} />
              <Divider size={1} color={colors.grey_008} />
            </StackItem>
            <Ripple
              onPress={() => setShowCount(!showCount)}
              style={styles().countContainer}
              rippleContainerBorderRadius={48 / 2}>
              {/* <Stack center style={styles().countContainer}> */}
              <TextView
                weight="medium"
                variant={FontSizes.regular}
                adjustsFontSizeToFit={true}
                style={styles().count}>
                {dataLength - 2}
              </TextView>
              {/* </Stack> */}
            </Ripple>
          </Stack>
          <View style={[styles().paddingHorizontal]}>
            <MailMessageItem
              data={data[dataLength - 1]}
              onPressCreateTask={onPressCreateTask}
              onPressRelatedTask={onPressRelatedTask}
              dataLength={dataLength}
              opened={true}
            />
          </View>
        </StackItem>
      )}
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingHorizontal: 22,
      // paddingBottom: 20,
    },
    paddingHorizontal: {
      paddingHorizontal: 22,
    },
    countContainer: {
      backgroundColor: colors.grey_001,
      borderRadius: 48 / 2,
      height: 48,
      width: 48,
      borderColor: colors.grey_008,
      borderWidth: 1.5,
      position: 'absolute',
      top: -24,
      left: 19,
      justifyContent: 'center',
      alignItems: 'center',
    },
    count: {
      color: colors.grey_013,
    },
    countView: {marginTop: 14},
  });
  return mergeStyles;
};
