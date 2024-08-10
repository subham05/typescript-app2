import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {TextView} from 'components';
import DeleteModal from 'components/DeleteModal';
import {t} from 'i18next';
import moment from 'moment';
import React, {FC, useRef, useState} from 'react';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Tooltip from 'react-native-walkthrough-tooltip';
import {attendanceWeekData} from 'request/AttendanceReport/types';
import {respHeight} from 'screens/Calendar/utils/responsive';
import {Stack} from 'stack-container';
import {totalWorkingHours} from '../AttendanceItemWithModal';
import {styles} from './index.styles';

interface attendanceWeekProps {
  item: attendanceWeekData;
  index: number;
  isDisabled: boolean;
  onLeaveApply: (val: string) => void;
}

const AttendanceWeek: FC<attendanceWeekProps> = ({
  item,
  index,
  isDisabled,
  onLeaveApply,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [checkOutTool, setCheckOutTool] = useState<boolean>(false);
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const menuRef = useRef(null);

  const RenderAbsentView = () => {
    return (
      <Stack spaceBelow={10} style={styles.view}>
        <Stack horizontal>
          <Stack style={styles.date}>
            <TextView
              weight="medium"
              variant={FontSizes.regular}
              style={{color: colors.white}}>
              {moment(item.date).format('DD')}
            </TextView>
            <TextView
              weight="medium"
              variant={FontSizes.xSmall}
              style={{color: colors.white}}>
              {item.day}
            </TextView>
          </Stack>
          <Stack style={[styles.time, styles.center]}>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.absent}>
              {t('attendance:absent')}
            </TextView>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  return (
    <>
      {!item.isAbsent ? (
        <Stack key={index.toString()}>
          <Stack spaceBelow={10} style={styles.view}>
            <Stack horizontal>
              <Stack style={styles.date}>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={{color: colors.white}}>
                  {moment(item.date).format('DD')}
                </TextView>
                <TextView
                  weight="medium"
                  variant={FontSizes.xSmall}
                  style={{color: colors.white}}>
                  {item.day}
                </TextView>
              </Stack>
              <Stack>
                {item.holiday ? (
                  <Stack style={[styles.time, styles.center]}>
                    <TextView
                      weight="regular"
                      variant={FontSizes.regular}
                      style={styles.holiday}>
                      {t('attendance:holiday')}
                    </TextView>
                  </Stack>
                ) : item.isLeave ? (
                  <Stack style={[styles.time, styles.center]}>
                    <TextView
                      weight="regular"
                      variant={FontSizes.regular}
                      style={styles.leave}>
                      {t('attendance:onLeave')}
                    </TextView>
                  </Stack>
                ) : (
                  <Stack
                    style={[styles.time, {paddingTop: respHeight(4)}]}
                    horizontal>
                    <Stack style={styles.checkIn}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={
                          !item.checkInLocation ? styles.marginTop : undefined
                        }>
                        {item.checkIn}
                      </TextView>
                      {item.checkInLocation && (
                        <Tooltip
                          isVisible={tooltipVisible}
                          backgroundColor={'transparent'}
                          content={
                            <TextView
                              weight="regular"
                              variant={FontSizes.small}>
                              {item.checkInLocation}
                            </TextView>
                          }
                          showChildInTooltip={false}
                          placement="top"
                          onClose={() => {
                            setTooltipVisible(false);
                          }}>
                          <TextView
                            weight="regular"
                            variant={FontSizes.xxSmall}
                            style={{color: colors.grey_003}}
                            truncate
                            onPress={() => {
                              setTooltipVisible(true);
                            }}>
                            {item.checkInLocation}
                          </TextView>
                        </Tooltip>
                      )}
                    </Stack>
                    <Stack
                      style={[
                        {
                          width: globalScreenWidth / 5,
                        },
                        styles.marginTop,
                      ]}
                      center>
                      {item.checkOut ? (
                        <>
                          <TextView
                            weight="regular"
                            variant={FontSizes.regular}
                            style={[
                              {
                                color:
                                  item.workingHours! < totalWorkingHours
                                    ? colors.red
                                    : colors.black,
                              },
                              !item.checkOutLocation
                                ? styles.marginTop
                                : {marginTop: respHeight(10)},
                            ]}>
                            {item.checkOut}
                          </TextView>
                          {item.checkOutLocation && (
                            <Tooltip
                              isVisible={checkOutTool}
                              backgroundColor={'transparent'}
                              content={
                                <TextView
                                  weight="regular"
                                  variant={FontSizes.small}>
                                  {item.checkOutLocation}
                                </TextView>
                              }
                              showChildInTooltip={false}
                              placement="top"
                              onClose={() => {
                                setCheckOutTool(false);
                              }}>
                              <TextView
                                weight="regular"
                                variant={FontSizes.xxSmall}
                                style={{color: colors.grey_003}}
                                truncate
                                onPress={() => {
                                  setCheckOutTool(true);
                                }}>
                                {item.checkOutLocation}
                              </TextView>
                            </Tooltip>
                          )}
                        </>
                      ) : (
                        <TextView
                          weight="regular"
                          variant={FontSizes.regular}
                          style={styles.top}>
                          - - -
                        </TextView>
                      )}
                    </Stack>
                    <Stack center style={styles.workingHours}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={[
                          {
                            color:
                              !item.workingHours ||
                              item.workingHours < totalWorkingHours
                                ? colors.red
                                : colors.black,
                          },
                          !item.workingHours ? styles.top : undefined,
                        ]}>
                        {item.workingHours ? item.workingHours : '- - -'}
                      </TextView>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <>
          {isDisabled ? (
            <RenderAbsentView />
          ) : (
            <Menu ref={menuRef}>
              <MenuTrigger disabled={isDisabled}>
                <RenderAbsentView />
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={styles.filterWidth}>
                <MenuOption
                  onSelect={() => {
                    setShowLeaveModal(true);
                  }}>
                  <TextView weight="regular" variant={FontSizes.regular}>
                    On leave
                  </TextView>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )}
        </>
      )}
      {showLeaveModal && (
        <DeleteModal
          reopenModal={showLeaveModal}
          setReopenModal={val => setShowLeaveModal(val)}
          Title={t('attendance:confirmApplyLeave')}
          onDeleteClick={() => {
            onLeaveApply(item.date);
          }}
          primaryBtnName={t('attendance:convert')}
        />
      )}
    </>
  );
};

export default AttendanceWeek;
