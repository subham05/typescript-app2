import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {DefaultButton, PrimaryButton} from 'components/Buttons';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import React, {FC} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {leaveNodes} from 'request/AttendanceReport/types';
import {styles} from './index.styles';
import EmptyComponent from 'components/EmptyComponent';
import {LEAVE_REQUEST_OPTIONS} from '../index';
import {FooterComponent} from 'components/FooterComponent';
import {colors} from 'common/theme/colors';
import {t} from 'i18next';

interface RequestListProps {
  data: leaveNodes[];
  isLoading: boolean;
  onClickBtn: (val: LEAVE_REQUEST_OPTIONS, selectedRecord: leaveNodes) => void;
  pageNumber: number;
  onEndReached: () => void;
  scrollHandler?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | Animated.Node<
        ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined
      >
    | undefined;
}

const RequestList: FC<RequestListProps> = ({
  data,
  scrollHandler,
  isLoading,
  onClickBtn,
  pageNumber,
  onEndReached,
}) => {
  return (
    <Animated.FlatList
      data={data}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        return (
          <View style={styles.outerMainView}>
            <TextView weight="medium" variant={FontSizes.medium} truncate>
              {item.userName}
            </TextView>

            <StackItem
              horizontal
              verticalAlign="center"
              style={styles.secondaryView}>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.appliedText}>
                {t('attendance:appliedFor')}
              </TextView>
              <StackItem horizontal verticalAlign="center" spacing={10}>
                <Icon name="calendar" size={20} color={colors.grey_003} />
                <TextView
                  weight="regular"
                  variant={FontSizes.small}
                  style={styles.date}>
                  {item.date}
                </TextView>
              </StackItem>
            </StackItem>

            <Stack
              horizontal
              style={styles.buttonsMainView}
              horizontalAlign="space-between">
              <DefaultButton
                title={t('attendance:disapprove')}
                onPress={() => {
                  onClickBtn(LEAVE_REQUEST_OPTIONS.DISAPPROVE, item);
                }}
                style={styles.button}
              />
              <PrimaryButton
                title={t('attendance:approve')}
                onPress={() => {
                  onClickBtn(LEAVE_REQUEST_OPTIONS.APPROVE, item);
                }}
                style={styles.button}
              />
            </Stack>
          </View>
        );
      }}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => (
        <View style={styles.footerSpacing}>
          {pageNumber && pageNumber > 1 && (
            <FooterComponent isLoading={isLoading} size={30} />
          )}
        </View>
      )}
      ListEmptyComponent={() => <EmptyComponent isVisible={!isLoading} />}
      onEndReached={onEndReached}
    />
  );
};

export default RequestList;
