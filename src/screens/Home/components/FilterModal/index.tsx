import {imageSources} from 'assets/images';
import Swap from 'assets/svgs/Vector.svg';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {FilterFooter} from 'components/FilterModal/FilterFooter';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Stack} from 'stack-container';
import {chartsType} from '../Chart';
import {ColorStatus, ColorStatusModal} from './components/ColorStatus';
import SequenceHomeScreen, {SequenceDataModal} from './components/Sequence';
import {Styles} from './index.styles';
import {useAppSelector} from 'store/hooks';

interface HomeScreenFilterModal {
  panelState: boolean;
  onPressClose: () => void;
  onPressApply: (
    colorState: ColorStatusModal[],
    sequenceObject: SequenceDataModal[],
  ) => void;
  onSetChartType: (value: string) => void;
  selectedChart: string;
}

export const HomeScreenFilterModal: React.FC<HomeScreenFilterModal> = ({
  panelState,
  onPressClose,
  onSetChartType,
  onPressApply,
  selectedChart,
}) => {
  const {t} = useTranslation();
  const {userData} = useAppSelector(state => state.formanagement);
  const currentOrderInitial = Number(
    userData?.dashboardCustomSettings?.SequenceDataOrder.map(item => item).join(
      '',
    ),
  );

  const [SequenceData, setSequencedata] = useState<SequenceDataModal[]>(
    userData?.dashboardCustomSettings?.SequenceData!,
  );
  const [isPanelActive, setIsPanelActive] = useState(panelState);
  const [currentOrder, setCurrentOrder] = useState(currentOrderInitial);
  const [colorState, setColorState] = useState<ColorStatusModal[]>(
    userData?.dashboardCustomSettings?.ColorStatusData!,
  );
  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };
  const applyPanel = () => {
    setIsPanelActive(false);
    onPressApply(colorState, SequenceData!);
  };
  useEffect(() => {
    setColorState(userData?.dashboardCustomSettings?.ColorStatusData!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeOrder = () => {
    let possibleCombination = [123, 231, 321, 312];
    let findIndex = possibleCombination.indexOf(currentOrder);
    let nextIndex = (findIndex + 1) % possibleCombination.length;
    setCurrentOrder(possibleCombination[nextIndex]);
  };

  const onColorChange = (color: string, index: number, statusIndex: number) => {
    if (colorState) {
      let copyColorState = [...colorState];
      let findColorStatusIndex = copyColorState.findIndex(
        item => item?.color === color,
      );
      copyColorState[findColorStatusIndex].color =
        colorState[statusIndex].color;
      copyColorState[statusIndex].color = color;
      setColorState(copyColorState);
    }
  };

  const styles = Styles();
  return (
    <Modal
      isVisible={isPanelActive}
      onBackdropPress={() => {
        closePanel();
      }}
      style={styles.bottomModal}
      avoidKeyboard={true}>
      <View style={[styles.bottomModalView]}>
        <Stack style={styles.flex}>
          <ScrollView>
            <Stack childrenGap={20} spacing={16}>
              <Stack childrenGap={15}>
                <TextView weight="medium" variant={FontSizes.medium}>
                  {t('homePage:graphStyle')}
                </TextView>
                <Stack horizontal horizontalAlign="space-between">
                  <TouchableOpacity
                    onPress={() => {
                      onSetChartType(chartsType.Bar);
                    }}>
                    <Image
                      source={
                        selectedChart === chartsType.Bar
                          ? imageSources.graphColor1
                          : imageSources.graph1
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      onSetChartType(chartsType.StackBar);
                    }}>
                    <Image
                      source={
                        selectedChart === chartsType.StackBar
                          ? imageSources.graphColor2
                          : imageSources.graph2
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      onSetChartType(chartsType.Pie);
                    }}>
                    <Image
                      source={
                        selectedChart === chartsType.Pie
                          ? imageSources.graphColor3
                          : imageSources.graph3
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      onSetChartType(chartsType.PieWithInnerRadius);
                    }}>
                    <Image
                      source={
                        selectedChart === chartsType.PieWithInnerRadius
                          ? imageSources.graphColor4
                          : imageSources.graph4
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      onSetChartType(chartsType.Line);
                    }}>
                    <Image
                      source={
                        selectedChart === chartsType.Line
                          ? imageSources.graphColor5
                          : imageSources.graph5
                      }
                    />
                  </TouchableOpacity>
                </Stack>
              </Stack>
              <Stack childrenGap={15}>
                <TextView weight="medium" variant={FontSizes.medium}>
                  {t('homePage:colour')}
                </TextView>
                <ColorStatus
                  data={colorState}
                  onSelectColor={(color, index, statusIndex) =>
                    onColorChange(color, index, statusIndex)
                  }
                />
              </Stack>
              <Stack
                childrenGap={15}
                horizontalAlign="space-between"
                horizontal>
                <TextView weight="medium" variant={FontSizes.medium}>
                  {t('homePage:sequence')}
                </TextView>
                <TouchableOpacity onPress={() => changeOrder()}>
                  <Swap />
                </TouchableOpacity>
              </Stack>
              <SequenceHomeScreen
                data={SequenceData}
                order={currentOrder}
                setSequenceObject={setSequencedata}
              />
            </Stack>
            <Stack spaceBelow={16}>
              <FilterFooter
                dashboardModal
                closePanel={closePanel}
                applyPanel={applyPanel}
              />
            </Stack>
          </ScrollView>
        </Stack>
      </View>
    </Modal>
  );
};
