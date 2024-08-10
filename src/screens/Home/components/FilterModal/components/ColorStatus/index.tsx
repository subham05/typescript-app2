import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
// import ColorPicker from 'react-native-wheel-color-picker';
// import Modal from 'react-native-modal';
import {Stack} from 'stack-container';
import {Styles} from '../../index.styles';
import {ColorBox} from '../ColorBox';
import {ColorBoxList} from '../ColorBoxList';
import {t} from 'i18next';
// import {PrimaryButton} from 'components/Buttons';
// import {useTranslation} from 'react-i18next';

interface ColorStatusProps {
  data: ColorStatusModal[];
  onSelectColor: (color: string, index: number, statusIndex: number) => void;
}

export interface ColorStatusModal {
  id: number;
  color: string;
  status: string;
  index?: number;
}

export interface usedColor {
  [key: string]: boolean;
}

enum PROGRESS_STATUS {
  INPROGRESS = 'inProgress',
  ASSIGNED = 'assigned',
  COMPLETE = 'complete',
  RESOLVED = 'resolved',
  OVERDUE = 'overdue',
  REOPENED = 'reOpened',
}

export const ColorStatus: React.FC<ColorStatusProps> = ({
  data,
  onSelectColor,
}) => {
  // const {t} = useTranslation();
  const [colorStatusDataState, setColorStatusDataState] = useState<
    ColorStatusModal[]
  >([]);

  useEffect(() => {
    const filter = data.filter(e => e.status !== PROGRESS_STATUS.ASSIGNED);
    setColorStatusDataState(filter);
  }, [data]);

  // const [colorsData, setColorsData] = useState<ColorStatusModal[]>([]);

  // useEffect(() => {
  //   if (data?.length) {
  //     setColorsData(data);
  //   }
  // }, [data]);

  // const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
  // const [colorPicked, setColorPicked] = useState<string>('');

  const getStatusName = (status: string) => {
    switch (status) {
      case PROGRESS_STATUS.INPROGRESS:
        return t('homePage:inProgress');
      case PROGRESS_STATUS.RESOLVED:
        return t('homePage:resolved');
      case PROGRESS_STATUS.COMPLETE:
        return t('homePage:complete');
      case PROGRESS_STATUS.OVERDUE:
        return t('homePage:overdue');
      case PROGRESS_STATUS.REOPENED:
        return t('homePage:reOpened');
      case PROGRESS_STATUS.ASSIGNED:
        return t('homePage:assigned');
      default:
        return '';
    }
  };

  const RenderItem = (item: ColorStatusModal) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return item.status !== 'Assigned' ? (
      <>
        <Stack spaceBelow={16}>
          <TouchableOpacity onPress={() => setIsOpen(prevState => !prevState)}>
            <Stack
              horizontal
              childrenGap={10}
              verticalAlign="center"
              style={styles.margin}>
              <ColorBox data={item.color} />
              <TextView
                weight={isOpen ? 'medium' : 'regular'}
                variant={FontSizes.regular}
                style={!isOpen ? {color: colors.primary} : undefined}>
                {getStatusName(item.status)}
              </TextView>
            </Stack>
          </TouchableOpacity>
        </Stack>
        {isOpen && (
          <Stack childrenGap={0}>
            <Stack horizontal childrenGap={10}>
              {/* <TouchableOpacity
                onPress={() => {
                  console.log('second');
                  // setIsColorPickerOpen(true);
                }}>
                <Stack style={styles.addColor}>
                  <Icon name="add_floating" color={colors.primary} />
                </Stack>
              </TouchableOpacity> */}
              <ColorBoxList
                data={colorStatusDataState}
                selectColor={(pickedColor, index) => {
                  onSelectColor(pickedColor, index, item.index!);
                }}
              />
            </Stack>
            <Divider />
          </Stack>
        )}
      </>
    ) : (
      <></>
    );
  };
  const styles = Styles();
  return (
    <>
      <FlatList
        data={colorStatusDataState}
        renderItem={({item, index}) => <RenderItem {...item} index={index} />}
        keyExtractor={(_, index) => index.toString()}
      />
      {/* {isColorPickerOpen && (
        <Modal
          isVisible={isColorPickerOpen}
          onBackdropPress={() => setIsColorPickerOpen(false)}>
          <View style={{backgroundColor: colors.white}}>
            <View style={styles.modalView}>
              <ColorPicker
                color={colorPicked}
                onColorChangeComplete={color => setColorPicked(color)}
                thumbSize={40}
                sliderSize={40}
                noSnap={false}
                row={false}
                swatchesLast={false}
                swatches={false}
                discrete={false}
              />
              <Stack style={styles.addColorButtons}>
                <PrimaryButton
                  title={t('add')}
                  onPress={() => {
                    colorsData.push(colorPicked);
                    setColorsData(colorsData);
                    setIsColorPickerOpen(false);
                  }}
                />
              </Stack>
            </View>
          </View>
        </Modal>
      )} */}
    </>
  );
};
