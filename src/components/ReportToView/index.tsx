import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import {RippleIconButton} from 'components/IconButtons';
import {membersProps} from 'components/Members/MembersItem';
import {MemberItem} from 'components/MembersList/MemberItem';
import {MemberList} from 'components/MembersList/MemberList';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {TextView} from 'components/TextView';
import {t} from 'i18next';
// import {debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import {useGetReportToListMutation} from 'request/AddManager';
import {ReportToResponseList} from 'request/AddManager/ReportToResponseData';
import {styles} from 'screens/AddPersonalAssistant/index.styles';
import {requestToData} from 'screens/CreateContact/types';
import {setReportToCompanyId} from 'store/Reducer';
import {useAppDispatch, useAppSelector} from 'store/hooks';

interface ReportToProps {
  role: string;
  reportToModal: boolean;
  disabled?: boolean;
  companyValue: string[];
  setReportToModal: (value: boolean) => void;
  setReportTo: (value: membersProps | ReportToResponseList) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
  reportTo: membersProps | ReportToResponseList | undefined;
  onReportToResult: (
    val: membersProps[] | ReportToResponseList[] | undefined,
  ) => void;
  reportToData: membersProps[] | ReportToResponseList[] | undefined;
}
export const RenderReportToView: React.FC<ReportToProps> = ({
  role,
  reportToModal,
  reportTo,
  companyValue,
  disabled = false,
  setReportToModal,
  setReportTo,
  setFieldValue,
  // onReportToResult,
  // reportToData,
}) => {
  const {userData} = useAppSelector(state => state.formanagement);
  const [searchReportText, setSearchReportText] = useState<string>();
  const [selfReported, setSelfReported] = useState<boolean>(true);
  const [reportToMembersList, setReportToMembersList] = useState<
    membersProps[] | ReportToResponseList[] | undefined
  >();

  const [
    getReportTo,
    {isSuccess: isReportToSuccess, data: serverResponse, isLoading},
  ] = useGetReportToListMutation();
  const dispatch = useAppDispatch();
  // const {reportToCompanyId} = useAppSelector(state => state.formanagement);

  useEffect(() => {
    if (
      companyValue?.length > 0 &&
      companyValue[0].length > 1 &&
      // companyValue[0] !== reportToCompanyId &&
      !reportToMembersList?.length
    ) {
      getReportTo({
        searchText: searchReportText,
        companyId: companyValue,
        role,
      });
      getReportTo({
        searchText: searchReportText || '',
        companyId: companyValue,
        role,
      });
    }
    if (reportToMembersList?.length && !searchReportText?.length) {
      // setReportToMembersList(reportToMembersList);
      getReportTo({
        searchText: searchReportText || '',
        companyId: companyValue,
        role,
      });
    }
    if (reportToMembersList?.length && searchReportText?.length) {
      // debouncedOnChange();
      onChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchReportText, companyValue]);

  const onChange = () => {
    getReportTo({
      searchText: searchReportText,
      companyId: companyValue,
      role,
    });
    getReportTo({
      searchText: searchReportText || '',
      companyId: companyValue,
      role,
    });
  };
  // const debouncedOnChange = debounce(onChange, 500);

  useEffect(() => {
    if (serverResponse) {
      setReportToMembersList([]);
      setReportToMembersList(serverResponse);
      dispatch(setReportToCompanyId(companyValue[0]));
      // onReportToResult(serverResponse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReportToSuccess]);

  const onPressReportTo = (
    val: membersProps | ReportToResponseList | requestToData | undefined,
  ) => {
    setSelfReported(false);
    setReportTo(val! as ReportToResponseList);
    setReportToModal(false);
  };

  return (
    <>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        {!selfReported ? (
          <Stack horizontal verticalAlign="center">
            <Persona
              name={userData?.name}
              image={userData?.profileUrl}
              size={38}
            />
            <Stack style={styles.view}>
              <TextView weight="medium" variant={FontSizes.regular} truncate>
                {userData?.name}
              </TextView>
            </Stack>
          </Stack>
        ) : reportTo?._id ? (
          <MemberItem
            item={reportTo}
            onPress={() => {
              setReportToModal(true);
            }}
            isDividerFalse
            disabled={disabled}
          />
        ) : (
          <TextView variant={FontSizes.medium} style={{color: colors.grey_003}}>
            {t('addTask:reporterPlaceholder')}
          </TextView>
        )}
      </Stack>
      <Modal
        avoidKeyboard
        isVisible={reportToModal}
        style={styles.bottomModal}
        onBackdropPress={() => setReportToModal(false)}>
        <View style={styles.bottomModalView}>
          <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            spacing={16}>
            <Stack>
              <TextView weight="bold" variant={FontSizes.large}>
                Report to
              </TextView>
            </Stack>
            <RippleIconButton
              name="close"
              size={22}
              onPress={() => setReportToModal(false)}
            />
          </Stack>
          <Stack spacing={16} style={styles.attachmentView}>
            <SearchTextField
              showBorder
              value={searchReportText}
              setSearchValue={setSearchReportText}
              pattern1={searchPattern1}
              pattern2={searchPattern2}
            />
          </Stack>
          <Stack spacing={16}>
            <MemberList
              data={reportToMembersList!}
              hideSelf
              onPress={val => {
                setSelfReported(false);
                onPressReportTo(val);
                setFieldValue('reportTo', val?._id);
              }}
              onPressSelf={val => {
                setSelfReported(true);
                onPressReportTo(val);
                setReportToModal(false);
                setFieldValue('reportTo', userData?._id);
              }}
              isFetching={isLoading}
              isLoadingReportTo={isLoading && reportToModal}
            />
          </Stack>
        </View>
      </Modal>
    </>
  );
};
