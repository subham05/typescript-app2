import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import {ReportList} from 'components/Report/ReportList';
import {Stack} from 'components/Stack';
import {EmployeesSignedInStackParamList} from 'navigation/Stacks/EmployeesStack/EmployeesSignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {reportList} from './mockData';

type Props = NativeStackScreenProps<EmployeesSignedInStackParamList>;
export const EmployeePerformanceReportScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  // const styles = Styles();
  return (
    <Container noSpacing>
      <Header label={t('performanceReport:head')} translateY={translateY} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={16}>
          <ReportList
            data={reportList}
            onPress={() => props.navigation.navigate('DetailPerformanceReport')}
          />
        </Stack>
      </Animated.ScrollView>
    </Container>
  );
};
