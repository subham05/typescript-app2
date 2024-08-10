import Netinfo from '@react-native-community/netinfo';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {IconView} from 'components/Icon';
import {t} from 'i18next';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import NoConnection from '../../assets/svgs/NoConnection.svg';
interface NetworkStatusViewProps {
  onRetry?: () => void;
  onPress?: () => void;
}

export const NetworkStatusView: React.FC<NetworkStatusViewProps> = ({
  onRetry,
  onPress,
}) => {
  const onCheckRetry = () => {
    Netinfo.fetch().then(state => {
      if (state.isConnected) {
        onRetry?.();
      } else {
        showToast(t('noNetwork'));
      }
    });
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={onPress} style={styles.paddingStyle}>
        <IconView name={'arrow_back'} />
      </TouchableOpacity>
      <View style={styles.container}>
        <NoConnection width={250} height={300} />
        <TextView variant={FontSizes.large} weight="bold">
          Ooops!
        </TextView>
        <TextView
          textAlign="center"
          variant={FontSizes.medium}
          style={styles.heading}>
          No internet connection found. Check your connection.
        </TextView>
        <View style={styles.buttonWrapper}>
          <PrimaryButton title="Retry" onPress={onCheckRetry} />
          {/* <Button onPress={onCheckRetry} title="Retry" /> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {padding: 10},
  heading: {width: 300, lineHeight: 20},
  paddingStyle: {
    paddingTop: 20,
    paddingLeft: 16,
  },
});
