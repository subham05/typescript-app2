import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {Stack} from 'stack-container';
import Modal from 'react-native-modal';

interface AttendanceReportItemProps {
  data: AttendanceReportModel;
}

export interface AttendanceModel {
  date: string;
  day: string;
  checkIn?: string | null;
  checkInLocation?: string | null;
  checkOut?: string | null;
  checkOutLocation?: string | null;
  workingHours?: string | null;
  holiday?: boolean;
  isLeave?: boolean;
  isAbsent?: boolean;
}

export interface AttendanceReportModel {
  range?: string;
  nodes: AttendanceModel[];
}

export const totalWorkingHours = '09:00:00';

export const AttendanceReportItem: React.FC<AttendanceReportItemProps> = ({
  data,
}) => {
  const {t} = useTranslation();

  const [isAbsent, setIsAbsent] = useState<boolean>(false);

  return (
    <Stack>
      <Stack spaceBelow={10}>
        {data.range && (
          <TextView weight="regular" variant={FontSizes.regular}>
            {data.range}
          </TextView>
        )}
      </Stack>
      {[...data.nodes].reverse().map((item, index) => {
        return (
          <TouchableOpacity
            key={index.toString()}
            disabled={item.isAbsent ? false : true}
            onLongPress={() => {
              setIsAbsent(true);
            }}>
            {isAbsent && item.isAbsent && (
              <Modal isVisible={isAbsent}>
                <TouchableOpacity
                  onPress={() => setIsAbsent(false)}
                  style={styles.onLeaveModal}>
                  <TextView weight="regular" variant={FontSizes.regular}>
                    On leave
                  </TextView>
                </TouchableOpacity>
              </Modal>
            )}
            <Stack spaceBelow={10} style={styles.view}>
              <Stack horizontal>
                <Stack style={styles.date}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.regular}
                    style={{color: colors.white}}>
                    {item.date}
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
                  ) : item.isAbsent ? (
                    <Stack style={[styles.time, styles.center]}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.absent}>
                        {t('attendance:absent')}
                      </TextView>
                    </Stack>
                  ) : (
                    <Stack style={styles.time} horizontal center>
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
                          <TextView
                            weight="regular"
                            variant={FontSizes.xxSmall}
                            style={{color: colors.grey_003}}
                            truncate>
                            {item.checkInLocation}
                          </TextView>
                        )}
                      </Stack>
                      <Stack
                        style={[
                          {
                            width: Dimensions.get('screen').width / 5,
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
                                  : undefined,
                              ]}>
                              {item.checkOut}
                            </TextView>
                            {item.checkOutLocation && (
                              <TextView
                                weight="regular"
                                variant={FontSizes.xxSmall}
                                style={{color: colors.grey_003}}
                                truncate>
                                {item.checkOutLocation}
                              </TextView>
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
          </TouchableOpacity>
        );
      })}
    </Stack>
  );
};

const styles = StyleSheet.create({
  view: {
    height: 53,
    backgroundColor: colors.white,
    borderRadius: 6,
    marginBottom: 10,
  },
  date: {
    height: 53,
    backgroundColor: colors.primary,
    width: Dimensions.get('screen').width / 7,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    justifyContent: 'flex-start',
    width: Dimensions.get('screen').width / 1.2,
    marginTop: 3,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 13,
  },
  holiday: {
    color: colors.yellow,
    left: -10,
  },
  leave: {
    color: colors.blue_001,
    left: -10,
  },
  absent: {
    color: colors.red_001,
    left: -10,
  },
  checkIn: {
    width: Dimensions.get('screen').width / 4.5,
    marginLeft: 16,
  },
  onLeaveModal: {
    height: 77,
    width: 166,
    backgroundColor: colors.white,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Dimensions.get('screen').width / 3,
    // top: 77,
  },
  workingHours: {
    width: Dimensions.get('screen').width / 3,
  },
  top: {marginTop: 4},
  marginTop: {marginTop: 6},
});
