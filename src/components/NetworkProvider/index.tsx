import React, {createContext, ReactNode} from 'react';
import {useEffect, useRef, useState} from 'react';
import Netinfo from '@react-native-community/netinfo';

interface networkStatus {
  netStatus: boolean | undefined;
  prevNetStatus: boolean | undefined;
}
export const NetworkContext = createContext<networkStatus>({
  netStatus: undefined,
  prevNetStatus: undefined,
});

function usePrevious(value: boolean) {
  const ref = useRef<boolean>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const NetworkProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [netStatus, setNetStatus] = useState(true);
  const prevNetStatus = usePrevious(netStatus);

  React.useEffect(() => {
    const networkInfo = Netinfo.addEventListener(state => {
      setNetStatus(state.isConnected!);
    });
    return networkInfo;
  }, []);

  return (
    <NetworkContext.Provider value={{netStatus, prevNetStatus}}>
      {children}
    </NetworkContext.Provider>
  );
};
