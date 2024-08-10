import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {MemberItem} from 'components/MembersList/MemberItem';
import {MemberList} from 'components/MembersList/MemberList';
import {SearchTextField, TextField} from 'components/TextField';
import {TouchableField} from 'components/TouchableField';
import {t} from 'i18next';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {CompanyListResponseProps} from 'request/CompanyList';
import {
  useGetRequestContactListMutation,
  useRequestContactMutation,
} from 'request/ContactRepository';
import {requestToData} from 'screens/CreateContact/types';
import {Stack} from 'stack-container';

interface requestModal {
  show: boolean;
  setShow: (value: boolean) => void;
  companyId: CompanyListResponseProps[];
}
const RequestContact: React.FC<requestModal> = ({show, setShow, companyId}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [contactNeed, setContactNeed] = useState<string>('');
  const [requestToList, setRequestToList] = useState<requestToData[]>([]);
  const [requestTo, setRequestTo] = useState<requestToData | undefined>(
    undefined,
  );
  const [requestToModal, setRequestToModal] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState(false);
  /***************************************************************** Request Contact API Integration ************************************************* */
  const [
    getRequestToList,
    {data: requestToListData, isSuccess: isRequestToSuccess},
  ] = useGetRequestContactListMutation();
  const [
    requestContact,
    {data: requestContactData, isSuccess: isRequestContactSuccess},
  ] = useRequestContactMutation();

  const requestBody = useMemo(() => {
    return {
      companyId: companyId?.map(companys => companys._id),
      searchText: searchValue,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, companyId]);

  useEffect(() => {
    if (requestBody) {
      getRequestToList(requestBody);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestBody]);
  useEffect(() => {
    if (requestTo && requestContactData && isRequestContactSuccess) {
      showToast(requestContactData.message);
      setShow?.(false);
    } else if (requestToListData && isRequestToSuccess) {
      const {data} = requestToListData;
      setRequestToList(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRequestToSuccess, isRequestContactSuccess]);
  /***************************************************************** RenderView start ************************************************* */
  const renderRequestToView = () => {
    return (
      <MemberItem
        item={requestTo}
        onPress={() => setRequestToModal(false)}
        isDividerFalse
      />
    );
  };
  return (
    <Stack>
      <Modal
        avoidKeyboard
        isVisible={show}
        style={styles.bottomModal}
        onBackdropPress={() => setShow?.(!show)}
        onBackButtonPress={() => setShow?.(!show)}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              style={{marginTop: 20}}
              spacing={16}>
              <Stack>
                <TextView weight="semibold" variant={FontSizes.large}>
                  {t('contacts:requestContact')}:
                </TextView>
              </Stack>
              {/* <RippleIconButton
              name="close"
              size={22}
              onPress={() => setShow?.(!show)}
            /> */}
            </Stack>
            {!requestToModal && (
              <>
                <Stack>
                  <TouchableField
                    icon={'arrow_expand_more'}
                    RenderView={renderRequestToView}
                    onPress={() => setRequestToModal(true)}
                    data={requestTo!}
                    style={[
                      styles.requestTouchable,
                      {
                        marginTop: 30,
                        borderColor:
                          isSubmit && !requestTo
                            ? colors.red_001
                            : colors.grey_002,
                      },
                    ]}
                    stackStyle={{padding: requestTo ? 5 : 12}}
                    placeholder={requestTo ? undefined : t('contacts:to')}
                  />
                </Stack>
                {isSubmit && !requestTo && !requestToModal && (
                  <TextView style={styles.requiredContactStyle}>
                    Request to is required
                  </TextView>
                )}
                <TextField
                  placeholder={t('contacts:contactNeed')}
                  containerStyles={[
                    styles.requestTouchable,
                    {
                      borderColor:
                        isSubmit && !contactNeed?.length
                          ? colors.red_001
                          : colors.grey_002,
                    },
                  ]}
                  onChangeText={setContactNeed}
                  multiline
                  numberOfLines={2}
                  value={contactNeed}
                />
              </>
            )}
            {isSubmit && !contactNeed?.length && !requestToModal && (
              <TextView style={styles.requiredContactStyle}>
                Request contact name is required
              </TextView>
            )}
            {requestToModal && (
              <Stack spacing={16} style={styles.attachmentView}>
                <SearchTextField
                  showBorder
                  value={searchValue}
                  pattern1={/[]/}
                  pattern2={
                    /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
                  }
                  setSearchValue={setSearchValue}
                />
                {isRequestToSuccess && !requestToListData?.data?.length && (
                  <Stack
                    verticalAlign="center"
                    style={{paddingTop: Dimensions.get('screen').height / 10}}>
                    <TextView variant={FontSizes.large} weight={'semibold'}>
                      User not found
                    </TextView>
                  </Stack>
                )}
              </Stack>
            )}

            {requestToModal && (
              <Stack spacing={16}>
                <MemberList
                  data={requestToList!}
                  onPress={val => {
                    setRequestTo(val! as requestToData);
                    setRequestToModal(false);
                  }}
                  hideSelf
                />
              </Stack>
            )}

            {!requestToModal && (
              <PrimaryButton
                title={t('contacts:sendReq')}
                onPress={() => {
                  if (!contactNeed?.length || !requestTo) {
                    setIsSubmit(true);
                  } else {
                    requestTo &&
                      requestContact({
                        companyId: requestTo?.companyId!,
                        requestTo: [requestTo?.userId!],
                        contactType: 'PUBLIC',
                        contactNeeded: contactNeed,
                      });
                  }
                }}
                width={Dimensions.get('screen').width / 2}
                alignButton
                style={styles.buttonStyle}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Stack>
  );
};

export default RequestContact;
const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    height: Dimensions.get('screen').height / 2.5,
    backgroundColor: colors.white,
  },
  attachmentView: {
    marginBottom: 16,
    marginTop: 16,
    // width: '90%',
  },
  requestTouchable: {
    borderWidth: 1,
    borderRadius: 2,
    marginHorizontal: 10,
    marginTop: 15,
    borderColor: colors.grey_002,
    maxHeight: Dimensions.get('screen').height / 8,
  },
  buttonStyle: {alignSelf: 'center', marginTop: 40},
  requiredContactStyle: {color: 'red', paddingLeft: 10},
});
