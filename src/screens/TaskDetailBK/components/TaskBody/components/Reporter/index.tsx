import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {RippleIconButton} from 'components/IconButtons';
import {membersProps} from 'components/Members/MembersItem';
import {MemberItem} from 'components/MembersList/MemberItem';
import {MemberList} from 'components/MembersList/MemberList';
import {Persona} from 'components/Persona';
import {StackItem} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {TouchableField} from 'components/TouchableField';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import {
  AssignToUsers,
  GetAssignee,
  // useLazyGetReportToCollectionQuery,
} from 'request/AddTask';
// import {useGetReportToCollectionQuery} from 'request/AddTask';
import {TaskDetails} from 'request/ManageTask';
import {Stack} from 'stack-container';
import {useAppSelector} from 'store/hooks';
import {Styles} from '../../index.styles';

interface ReporterTaskBodyProps {
  taskProps?: TaskDetails;
  isEditable: boolean | undefined;
  onReporterChange: (value: string) => void;
}
export const ReporterTaskBody: React.FC<ReporterTaskBodyProps> = ({
  taskProps,
  isEditable,
  onReporterChange,
}) => {
  const {t} = useTranslation();

  const {userData} = useAppSelector(state => state.formanagement);
  // const {data: reportToResponse} = useGetReportToCollectionQuery();

  // const [reportTrigger, {error: errorReport}] =
  //   useLazyGetReportToCollectionQuery();

  // console.log('errorReport->', errorReport);

  // const reportToMembersList: membersProps[] | undefined = [];

  const [
    reportToMembersList,
    // , setReportToMembersList
  ] = useState<membersProps[] | AssignToUsers[] | undefined>();

  const [searchReportText, setSearchReportText] = useState('');
  const [reportToModal, setReportToModal] = useState<boolean>(false);
  const [selfReported, setSelfReported] = useState<boolean>(false);
  const [reportTo, setReportTo] = useState<
    membersProps | AssignToUsers | GetAssignee
  >({
    _id: userData?._id,
    name: userData?.name,
    position: userData?.role.type,
    profilePic: userData?.profileUrl,
  });

  const [reporterName, setReporterName] = useState<string | undefined>();
  const [reporterDesignation, setReporterDesignation] = useState<string>();
  // const [selectedCompany, setSelectedCompany] = useState<string | undefined>(
  //   '',
  // );
  // useEffect(() => {
  //   setSelectedCompany(taskProps?.company);
  // }, [taskProps]);

  // useEffect(() => {
  //   setReportToMembersList([]);
  //   let obj = {
  //     searchText: searchReportText,
  //     companyId: selectedCompany?._id || selectedCompany,
  //   };
  //   reportTrigger(obj).then(res => {
  //     setReportToMembersList([]);
  //     setReportToMembersList(res.data);
  //   });
  // }, [reportTrigger, searchReportText, selectedCompany]);

  // useEffect(() => {
  //   const ind = reportToMembersList?.findIndex(
  //     x => x._id === taskProps?.reportTo,
  //   );
  //   if (ind! >= 0 && reportToMembersList) {
  //     setSelfReported(false);
  //     setReportTo(reportToMembersList[ind!]);
  //     setReporterName(reportToMembersList[ind!].name);
  //     setReporterDesignation(reportToMembersList[ind!]?.role?.type);
  //   } else {
  //     setSelfReported(true);
  //     setReportTo({
  //       _id: '617b996a23524140cd3f0560',
  //       profilePic:
  //         'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY',
  //       name: 'Leslie Alexander',
  //       position: 'Manager',
  //     });
  //     setReporterName('Leslie Alexander');
  //     setReporterDesignation('Manager');
  //   }
  // }, [reportToMembersList, taskProps?.reportTo]);

  useEffect(() => {
    if (taskProps?.reporter && taskProps?.reporter?._id !== userData?._id) {
      setSelfReported(false);
      setReportTo(taskProps?.reporter);
      setReporterName(taskProps?.reporter?.name);
      setReporterDesignation(taskProps?.reporter?.role?.type);
    } else {
      setSelfReported(true);
      setReportTo({
        _id: userData?._id,
        profilePic: userData?.profileUrl,
        name: userData?.name,
        position: userData?.role?.type,
      });
      setReporterName(userData?.name);
      setReporterDesignation(userData?.role?.type);
    }
  }, [reportToMembersList, taskProps, userData]);

  const onPressReportTo = (
    val: membersProps | AssignToUsers | GetAssignee | undefined,
  ) => {
    // setSelfReported(false);
    setReportTo(val);
    onReporterChange(val?._id);
    setReportToModal(false);
  };

  const RenderReportToView = () => {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        {selfReported ? (
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
        ) : (
          <MemberItem
            item={reportTo}
            onPress={() => {
              setReportToModal(true);
            }}
            isDividerFalse
          />
        )}
      </Stack>
    );
  };

  const styles = Styles();
  return (
    <>
      {!isEditable ? (
        <StackItem childrenGap={5} style={styles.openBox}>
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.label}>
            {t('taskDetails:reporterName')}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.value}>
            {reporterName}
          </TextView>
          <Divider />
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.label}>
            {t('taskDetails:designationReporter')}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.value}>
            {reporterDesignation}
          </TextView>
        </StackItem>
      ) : (
        <Stack>
          <TouchableField
            label={t('addTask:reportTo')}
            icon={'arrow_expand_more'}
            RenderView={RenderReportToView}
            onPress={() => {
              setReportToModal(true);
            }}
            data={reportTo}
            placeholder={
              reportTo ? undefined : t('addTask:reporterPlaceholder')
            }
            disabled
            disabledNoBackground
          />
        </Stack>
      )}

      {reportToModal && (
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
              />
            </Stack>
            {/* <ScrollView> */}
            <Stack spacing={16}>
              <MemberList
                data={reportToMembersList!}
                onPress={val => {
                  setSelfReported(false);
                  onPressReportTo(val);
                }}
                onPressSelf={val => {
                  setSelfReported(true);
                  onPressReportTo(val);
                  setReportToModal(false);
                }}
              />
            </Stack>
            {/* </ScrollView> */}
          </View>
        </Modal>
      )}
    </>
  );
};
