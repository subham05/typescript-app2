import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {FloatingButton} from 'components/FloatingButton';
import {Stack} from 'components/Stack';
import {NavContext} from 'navigation/router';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';

export const WalkthroughScreen = () => {
  const {t} = useTranslation();

  const images = [
    require('../../../assets/images/walkthrough/walkthrough1.png'),
    require('../../../assets/images/walkthrough/walkthrough2.png'),
    require('../../../assets/images/walkthrough/walkthrough3.png'),
  ];
  const [imageCount, setImageCount] = useState<number>(0);
  useEffect(() => {
    setImageCount(0);
  }, []);

  const {saveWalkthrough} = useContext(NavContext);

  return (
    <Container noSpacing>
      <Stack spacing={15} style={styles().mainStack}>
        <TouchableOpacity onPress={saveWalkthrough} style={styles().skip}>
          <TextView
            weight="medium"
            variant={FontSizes.small}
            style={styles().skipText}>
            {t('login:skip')}
          </TextView>
        </TouchableOpacity>
        <SliderBox
          images={images}
          sliderBoxHeight={350}
          onCurrentImagePressed={(index: any) => {
            console.warn(`image ${index} pressed`);
          }}
          currentImageEmitter={(index: any) => {
            setImageCount(index);
          }}
          //   key={imageCount}
          dotColor={colors.primary}
          inactiveDotColor={colors.primary_005}
          dotStyle={styles().dotStyle}
        />
        <TextView
          weight="medium"
          variant={FontSizes.large}
          style={styles().text}>
          {t('login:walkthrough')}
        </TextView>
      </Stack>
      <Stack
        horizontal
        horizontalAlign="space-between"
        style={styles().bottomView}>
        <Stack horizontal>
          <View
            style={imageCount === 0 ? styles().selected : styles().notSelected}
          />
          <View
            style={imageCount === 1 ? styles().selected : styles().notSelected}
          />
          <View
            style={imageCount === 2 ? styles().selected : styles().notSelected}
          />
        </Stack>
        <FloatingButton
          name="long_arrow_right"
          size={24}
          onPress={() => {
            if (imageCount !== 2) {
              setImageCount(imageCount + 1);
            } else {
              saveWalkthrough();
              // props.navigation.dispatch(
              //   StackActions.replace('EnablePermission'),
              // );
            }
          }}
        />
      </Stack>
    </Container>
  );
};

const styles = () => {
  const loginStyles = StyleSheet.create({
    skip: {
      alignSelf: 'flex-end',
      marginBottom: '10%',
    },
    skipText: {
      color: colors.grey_003,
    },
    dotStyle: {
      height: 0,
      // width: 24,
      // borderRadius: 10,
      // marginHorizontal: 10,
      // padding: 0,
      // margin: 0,
    },
    text: {
      marginTop: '10%',
      textAlign: 'center',
      marginHorizontal: 26,
    },
    mainStack: {
      flex: 1,
      // marginTop: Dimensions.get('screen').height * 0.03,
      justifyContent: 'center',
    },
    bottomView: {
      marginBottom: '5%',
      marginLeft: 26,
    },
    selected: {
      backgroundColor: colors.primary,
      height: 7,
      width: 24,
      borderRadius: 10,
      marginBottom: '50%',
      marginRight: 10,
    },
    notSelected: {
      backgroundColor: colors.primary_003,
      height: 7,
      width: 24,
      borderRadius: 10,
      marginBottom: '50%',
      marginRight: 10,
    },
  });
  return loginStyles;
};
