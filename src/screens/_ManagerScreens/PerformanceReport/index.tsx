import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import {FilterIcon} from 'components/FilterIcon';
import Header from 'components/Header';
import {SearchTextField} from 'components/InputView';
import {ReportList} from 'components/Report/ReportList';
import {Stack} from 'components/Stack';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {reportList} from 'screens/PerformanceReport/mockData';
import {PerformanceReportBottomPanel} from './components/BottomPanel';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<ManagerSignedInStackParamList>;
export const ManagerPerformanceReportScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [countFilter, setCountFilter] = useState<number>(0);

  const [isPanelActive, setIsPanelActive] = useState(false);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const renderLeftContainer = () => {
    return <FilterIcon count={countFilter} onPress={() => openPanel()} />;
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        label={t('performanceReport:head')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField />
      </Stack>
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
      {isPanelActive && (
        <PerformanceReportBottomPanel
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          filterCount={val => setCountFilter(val)}
        />
      )}
    </Container>
  );
};
