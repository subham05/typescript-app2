import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  accessLogsObjModal,
  useGetAccessLogsMutation,
  useGetContactLogsMutation,
  useGetVoiceNoteAccessLogMutation,
} from 'request/AccessLogs';
import {AccessLogsList} from './components/AccessLogsList';

type Props = NativeStackScreenProps<SignedInStackParamList, 'AccessLogs'>;
export const AccessLogsScreen = (props: Props) => {
  const {params} = props.route;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [accessLogList, setAccessLogList] = useState<accessLogsObjModal[]>([]);
  const lastPageRef = useRef<boolean>(false);
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [
    getVoiceNoteAccessLogs,
    {
      data: voiceNoteAccessLogsData,
      isLoading: isVoiceAccessLogLoading,
      isSuccess: isVoiceLogSuccess,
    },
  ] = useGetVoiceNoteAccessLogMutation();

  const [
    getDocAccessLogs,
    {
      data: accessLogsData,
      isLoading: isAccessLogLoading,
      isSuccess: isAccesssLogSuccess,
    },
  ] = useGetAccessLogsMutation();
  const [
    getContactAccessLogs,
    {
      data: accessLogsContactData,
      isLoading: isAccessLogContactLoading,
      isSuccess: isAccesssLogContactSuccess,
    },
  ] = useGetContactLogsMutation();
  const requestObj = useMemo(() => {
    return {
      documentId: params?.documentId || params?.voiceNoteId,
      action: params?.isShareWithMe ? 'SHARE' : 'READ',
      pageNo: pageNumber,
      voicenoteId: params?.voiceNoteId,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageNumber,
    params?.isShareWithMe,
    params?.documentId,
    isRefresh,
    params?.voiceNoteId,
  ]);

  useEffect(() => {
    if (requestObj) {
      params?.isContact
        ? getContactAccessLogs(requestObj)
        : params?.documentId
        ? getDocAccessLogs(requestObj)
        : getVoiceNoteAccessLogs(requestObj);
      // console.log('refresh:', isRefresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestObj, isRefresh]);
  useEffect(() => {
    if (
      (isAccesssLogSuccess && accessLogsData) ||
      (isAccesssLogContactSuccess && accessLogsContactData) ||
      (isVoiceLogSuccess && voiceNoteAccessLogsData)
    ) {
      if (isVoiceLogSuccess) {
        const nodeList =
          pageNumber === 1
            ? voiceNoteAccessLogsData?.nodes
            : accessLogList.concat(voiceNoteAccessLogsData?.nodes);
        setAccessLogList(nodeList);
        lastPageRef.current = voiceNoteAccessLogsData?.pageInfo?.hasNextPage!;

        setIsRefresh(false);
      } else {
        const {nodes, pageInfo} = params?.isContact
          ? accessLogsContactData!
          : accessLogsData!;
        const nodeList = pageNumber === 1 ? nodes : accessLogList.concat(nodes);
        lastPageRef.current = pageInfo.hasNextPage;
        setAccessLogList(nodeList);
        setIsRefresh(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccesssLogSuccess, isAccesssLogContactSuccess, isVoiceLogSuccess]);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('document:accessLogs')}
        translateY={translateY}
      />
      <Stack
        spacing={16}
        spaceBelow={16}
        style={{
          height: Dimensions.get('screen').height / 1.23,
        }}>
        <AccessLogsList
          onScrollHandler={scrollHandler}
          data={accessLogList}
          isLoading={
            isAccessLogLoading ||
            isAccessLogContactLoading ||
            isVoiceAccessLogLoading
          }
          pageNo={pageNumber}
          onEndReach={() =>
            lastPageRef.current &&
            !isAccessLogContactLoading &&
            !isAccessLogLoading &&
            !isVoiceAccessLogLoading &&
            setPageNumber(pageNumber + 1)
          }
          refresh={isRefresh}
          getRefresh={() => {
            setPageNumber(1);
            setIsRefresh(true);
          }}
        />
      </Stack>
    </Container>
  );
};
