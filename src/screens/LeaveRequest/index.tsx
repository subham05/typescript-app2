import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  useLeaveChangeStatusMutation,
  useLeaveRequestMutation,
} from 'request/AttendanceReport';
import {leaveNodes, leaveStatusBody} from 'request/AttendanceReport/types';
import RequestList from './RequestList';
import DeleteModal from 'components/DeleteModal';
import {t} from 'i18next';
import Loader from 'components/Loader';
import {showToast} from 'common/utils/ToastMessage';
import {pageInfo} from 'screens/Contacts';

type Props = NativeStackScreenProps<SignedInStackParamList, 'LeaveRequest'>;

export enum LEAVE_REQUEST_OPTIONS {
  APPROVE = 'approve',
  DISAPPROVE = 'disapprove',
}

const LeaveRequest: FC<Props> = () => {
  const translateY = useSharedValue(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [leaveListing, {data, isSuccess, isLoading}] =
    useLeaveRequestMutation();
  const [leaveData, setLeaveData] = useState<leaveNodes[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [buttonValue, setButtonValue] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<leaveNodes>();
  const [pages, setPages] = useState<pageInfo>();

  const [
    changeLeaveStatus,
    {data: statusData, isSuccess: isSuccessStatus, isLoading: isLoadingStatus},
  ] = useLeaveChangeStatusMutation();

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const reqObj = useMemo(() => {
    return {
      pageNo: pageNumber,
    };
  }, [pageNumber]);

  useEffect(() => {
    leaveListing(reqObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqObj]);

  useEffect(() => {
    if (data && isSuccess) {
      setLeaveData(prev => prev.concat(data.data.nodes));
      setPages(data.data.pageInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const onButtonClick = () => {
    if (buttonValue !== '' && selectedRequest) {
      let bodyObj: leaveStatusBody = {
        requestId: selectedRequest?._id,
        leaveStatus: '',
      };
      if (buttonValue === LEAVE_REQUEST_OPTIONS.APPROVE) {
        bodyObj.leaveStatus = 'Approved';
      } else {
        bodyObj.leaveStatus = 'Disapproved';
      }
      changeLeaveStatus(bodyObj);
    }
  };

  useEffect(() => {
    if (isSuccessStatus && statusData) {
      if (statusData.success) {
        setPageNumber(1);
        setLeaveData([]);
        leaveListing(reqObj);
      }
      showToast(statusData.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessStatus]);

  const onEndReached = () => {
    if (pages?.hasNextPage && !isLoading) {
      setPageNumber(prev => prev + 1);
    }
  };

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        translateY={translateY}
        label="Leave request"
      />
      {(isLoading || isLoadingStatus) && pageNumber === 1 && <Loader />}
      <RequestList
        data={leaveData}
        scrollHandler={scrollHandler}
        isLoading={isLoading}
        onClickBtn={(val, selectedRecord) => {
          setShowConfirmModal(true);
          setButtonValue(val);
          setSelectedRequest(selectedRecord);
        }}
        pageNumber={pageNumber}
        onEndReached={onEndReached}
      />
      <DeleteModal
        reopenModal={showConfirmModal}
        setReopenModal={val => setShowConfirmModal(val)}
        Title={
          buttonValue === LEAVE_REQUEST_OPTIONS.APPROVE
            ? t('attendance:approveLeave')
            : t('attendance:disapproveLeave')
        }
        onDeleteClick={() => {
          onButtonClick();
        }}
        primaryBtnName={t('attendance:yes')}
        secondaryBtnName={t('attendance:no')}
      />
    </Container>
  );
};

export default LeaveRequest;
