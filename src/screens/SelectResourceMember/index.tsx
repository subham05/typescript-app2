import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {userTypes} from 'common/users/userTypes';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Platform} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {selectMember, useGetSelectMemberListMutation} from 'request/Calendar';
import {useAppSelector} from 'store/hooks';
import {StaffSubmenuModal} from 'store/Reducer';
import {ResourceMembersList} from './components/ResourceMemberList';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'SelectMember'>;
export const SelectResourceMember = ({navigation}: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [filterMembers, setFilterMembers] = useState<selectMember[]>([]);
  const [staffMenuList, setStaffMenuList] = useState<StaffSubmenuModal[] | []>(
    [],
  );
  const hasNextPage = useRef<boolean>(false);
  const {companyId, userData} = useAppSelector(state => state?.formanagement);
  const [
    getSelectMembers,
    {data: memberData, isSuccess: isMemberSuccess, isLoading: isMemberLoading},
  ] = useGetSelectMemberListMutation();

  useEffect(() => {
    getStaffOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const requestObj = useMemo(() => {
    return {
      companies: companyId.map(id => id._id),
      role: selectedRole,
      pageNo: pageNumber,
      searchValue: searchText,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, pageNumber, searchText, selectedRole, refresh]);

  useEffect(() => {
    getSelectMembers(requestObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestObj]);

  useEffect(() => {
    if (isMemberSuccess && memberData) {
      const {nodes, pageInfo} = memberData.data;
      hasNextPage.current = pageInfo.hasNextPage;
      pageNumber === 1
        ? setFilterMembers(nodes)
        : setFilterMembers(prev => prev.concat(nodes));
      setRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMemberSuccess]);

  const getOptions = (user: string) => {
    const isPresent = selectedRole?.find(role => role === user);
    switch (user) {
      case userTypes.Owner.toUpperCase():
        return {
          name: (
            <Stack
              center={true}
              horizontal
              horizontalAlign="space-between"
              style={{width: 150, marginBottom: -10, paddingTop: 5}}>
              <TextView weight="medium">{t('drawer:owner')}</TextView>
              {isPresent ? (
                <Icon name="check_box" size={20} color={colors.black} />
              ) : (
                <Icon name="check_box_blank" size={20} color={colors.black} />
              )}
            </Stack>
          ),
          onClick: () => {
            if (!isPresent) {
              setPageNumber(1);
              setSelectedRole([...selectedRole, userTypes.Owner.toUpperCase()]);
            } else {
              if (
                userData?.role.type !== 'OWNER' &&
                userData?.primary !== 'YES' &&
                selectedRole.length > 1
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(item => item !== userTypes.Owner.toUpperCase()),
                );
              } else if (
                userData?.role.type === 'OWNER' &&
                userData?.primary === 'YES'
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(item => item !== userTypes.Owner.toUpperCase()),
                );
              }
            }
          },
        };
      case userTypes.persoalAssistant:
        return {
          name: (
            <Stack
              center={true}
              horizontal
              horizontalAlign="space-between"
              style={{width: 150, marginBottom: -10, paddingTop: 5}}>
              <TextView weight="medium">
                {t('drawer:personalAssistant')}
              </TextView>
              {isPresent ? (
                <Icon name="check_box" size={20} color={colors.black} />
              ) : (
                <Icon name="check_box_blank" size={20} color={colors.black} />
              )}
            </Stack>
          ),
          onClick: () => {
            if (!isPresent) {
              setPageNumber(1);
              setSelectedRole([...selectedRole, userTypes.persoalAssistant]);
            } else {
              if (
                userData?.role.type !== 'OWNER' &&
                userData?.primary !== 'YES' &&
                selectedRole.length > 1
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(item => item !== userTypes.persoalAssistant),
                );
              } else if (
                userData?.role.type === 'OWNER' &&
                userData?.primary === 'YES'
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(item => item !== userTypes.persoalAssistant),
                );
              }
            }
          },
        };
      case userTypes.GeneralManager:
        return {
          name: (
            <Stack
              center={true}
              horizontal
              horizontalAlign="space-between"
              style={{width: 150, marginBottom: -10, paddingTop: 5}}>
              <TextView weight="medium">{t('drawer:generalManager')}</TextView>
              {isPresent ? (
                <Icon name="check_box" size={20} color={colors.black} />
              ) : (
                <Icon name="check_box_blank" size={20} color={colors.black} />
              )}
            </Stack>
          ),
          onClick: () => {
            if (!isPresent) {
              setPageNumber(1);
              setSelectedRole([...selectedRole, userTypes.GeneralManager]);
            } else {
              if (
                userData?.role.type !== 'OWNER' &&
                userData?.primary !== 'YES' &&
                selectedRole.length > 1
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(item => item !== userTypes.GeneralManager),
                );
              } else if (
                userData?.role.type === 'OWNER' &&
                userData?.primary === 'YES'
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(item => item !== userTypes.GeneralManager),
                );
              }
            }
          },
        };
      case userTypes.Manager.toUpperCase():
        return {
          name: (
            <Stack
              center={true}
              horizontal
              horizontalAlign="space-between"
              style={{width: 150, marginBottom: -10, paddingTop: 5}}>
              <TextView weight="medium">{t('drawer:manager')}</TextView>
              {isPresent ? (
                <Icon name="check_box" size={20} color={colors.black} />
              ) : (
                <Icon name="check_box_blank" size={20} color={colors.black} />
              )}
            </Stack>
          ),
          onClick: () => {
            if (!isPresent) {
              setPageNumber(1);
              setSelectedRole([
                ...selectedRole,
                userTypes.Manager.toUpperCase(),
              ]);
            } else {
              if (
                userData?.role.type !== 'OWNER' &&
                userData?.primary !== 'YES' &&
                selectedRole.length > 1
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(item => item !== userTypes.Manager.toUpperCase()),
                );
              } else if (
                userData?.role.type === 'OWNER' &&
                userData?.primary === 'YES'
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(item => item !== userTypes.Manager.toUpperCase()),
                );
              }
            }
          },
        };
      case userTypes.Employee.toUpperCase():
        return {
          name: (
            <Stack
              center={true}
              horizontal
              horizontalAlign="space-between"
              style={{width: 150, marginBottom: -10, paddingTop: 5}}>
              <TextView weight="medium">{t('drawer:employee')}</TextView>
              {isPresent ? (
                <Icon name="check_box" size={20} color={colors.black} />
              ) : (
                <Icon name="check_box_blank" size={20} color={colors.black} />
              )}
            </Stack>
          ),
          onClick: () => {
            if (!isPresent) {
              setPageNumber(1);
              setSelectedRole([
                ...selectedRole,
                userTypes.Employee.toUpperCase(),
              ]);
            } else {
              if (
                userData?.role.type !== 'OWNER' &&
                userData?.primary !== 'YES' &&
                selectedRole.length > 1
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(
                    item => item !== userTypes.Employee.toUpperCase(),
                  ),
                );
              } else if (
                userData?.role.type === 'OWNER' &&
                userData?.primary === 'YES'
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(
                    item => item !== userTypes.Employee.toUpperCase(),
                  ),
                );
              }
            }
          },
        };
      case userTypes.Vendor.toUpperCase():
        return {
          name: (
            <Stack
              center={true}
              horizontal
              horizontalAlign="space-between"
              style={{width: 150, marginBottom: -10, paddingTop: 5}}>
              <TextView weight="medium">{t('drawer:vendor')}</TextView>
              {isPresent ? (
                <Icon name="check_box" size={20} color={colors.black} />
              ) : (
                <Icon name="check_box_blank" size={20} color={colors.black} />
              )}
            </Stack>
          ),
          onClick: () => {
            if (!isPresent) {
              setPageNumber(1);
              setSelectedRole([
                ...selectedRole,
                userTypes.Vendor.toUpperCase(),
              ]);
            } else {
              if (
                userData?.role.type !== 'OWNER' &&
                userData?.primary !== 'YES' &&
                selectedRole.length > 1
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(item => item !== userTypes.Vendor.toUpperCase()),
                );
              } else if (
                userData?.role.type === 'OWNER' &&
                userData?.primary === 'YES'
              ) {
                setPageNumber(1);
                setSelectedRole(prev =>
                  prev.filter(item => item !== userTypes.Vendor.toUpperCase()),
                );
              }
            }
          },
        };

      default:
        return {
          name: '',
          onClick: () => {},
        };
    }
  };
  const menuDataPrivate: MenuModel[] = staffMenuList?.map(
    (item: StaffSubmenuModal) => getOptions(item.user),
  );
  const getStaffOptions = async () => {
    let staffListTemp = await AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA);
    staffListTemp = JSON.parse(staffListTemp);
    staffListTemp = staffListTemp?.activityLogs;
    setStaffMenuList(staffListTemp);
    setSelectedRole([...selectedRole, staffListTemp[0]?.user]);
  };
  const renderLeftContainer = () => {
    return (
      <PopupMenu
        data={menuDataPrivate}
        height={
          staffMenuList.length *
          (Platform.OS === 'ios'
            ? Dimensions.get('screen').height / 20
            : Dimensions.get('screen').height / 17)
        }
        width={182}
        optionPadding={5}
        // menuStyle={{marginTop: 50}}
      />
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('calendarPage:selectMember')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
        isCloseNavigation
      />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField
          setSearchValue={val => {
            setSearchText(val.trim());
          }}
          pattern1={/[]/}
          pattern2={
            /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
          }
        />
      </Stack>
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <Stack spacing={16} spaceBelow={50}>
        <ResourceMembersList
          data={filterMembers}
          dataLength={memberData?.data?.nodes?.length}
          onPress={data => {
            navigation.navigate('Calender', {user: data});
          }}
          isRefresh={refresh}
          isLoading={isMemberLoading}
          pageNumber={pageNumber}
          setPageNo={() =>
            hasNextPage.current &&
            !isMemberLoading &&
            setPageNumber(pageNumber + 1)
          }
          onRefresh={() => {
            setPageNumber(1);
            setRefresh(true);
          }}
          isSuccess={isMemberSuccess}
        />
      </Stack>
      {/* </Animated.ScrollView> */}

      {isMemberLoading && pageNumber === 1 && !searchText.length && <Loader />}
    </Container>
  );
};
