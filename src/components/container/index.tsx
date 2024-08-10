import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Netinfo from '@react-native-community/netinfo';
import {colors} from 'common/theme/colors';
import {Spacing} from 'common/theme/spacing';
import {NetworkStatusView} from 'components';
import {OfflineStatusBar} from 'components/NetworkStatusView/OfflineStatusBar';
import {AuthContext} from 'navigation/router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
interface ContainerProps {
  onRetry?: () => void;
  children: React.ReactNode;
  noSpacing?: boolean;
  onPress?: () => void;
}

export const Container: React.FC<ContainerProps> = ({
  onRetry,
  children,
  noSpacing,
  onPress,
}) => {
  const {signOut} = useContext(AuthContext);

  const [networkState, setNetworkState] = useState<boolean | undefined>(true);

  const [token, setToken] = useState<string | null>();

  AsyncStorage.getItem(STR_KEYS.USERTOKEN).then(res => setToken(res));

  useEffect(() => {
    if (token === null) {
      signOut();
    }
  }, [signOut, token]);

  useEffect(() => {
    Netinfo.fetch().then(state => {
      setNetworkState(state.isConnected!);
    });
  }, []);

  const onSuccessRetry = () => {
    setNetworkState(true);
    onRetry?.();
  };

  const spacingStyle = noSpacing ? undefined : styles().spacingHorizontal;
  return (
    <>
      <StatusBar backgroundColor={'#F5F5F9'} barStyle={'dark-content'} />
      <SafeAreaView style={[styles().container, spacingStyle]}>
        <>
          {networkState ? (
            <>
              <OfflineStatusBar />
              {children}
            </>
          ) : (
            <NetworkStatusView onRetry={onSuccessRetry} onPress={onPress} />
          )}
        </>
      </SafeAreaView>
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.grey_001,
    },
    spacingHorizontal: {
      marginHorizontal: Spacing.basic,
    },
  });
  return mergeStyles;
};
