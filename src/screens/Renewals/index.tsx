import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {ToolTip} from 'components/Tooltip';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {renewalInterface, useGetRenewalMutation} from 'request/Renewals';
import {useAppSelector} from 'store/hooks';
import {RenewalsBottomPanelModal} from './components/BottomPanelModal';
import {RenewalsList} from './components/RenewalsList';
import {Styles} from './index.styles';
import {TouchableOpacity} from 'react-native';
import {FilterIcon} from 'components/FilterIcon';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import {Icon} from 'components/Icon';

type Props = NativeStackScreenProps<SignedInStackParamList, 'Renewals'>;
export const RenewalsScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [tooltipSeen, setTooltipSeen] = useState<string | null>('');

  AsyncStorage.getItem(STR_KEYS.TOOLTIP_RENEWALS_SEEN).then(res => {
    setTooltipSeen(res);
  });

  const {companyId} = useAppSelector(state => state?.formanagement);

  // const [swipeModal, setSwipeModal] = useState<boolean>(false);

  const [search, setSearchText] = useState<string>('');
  const [pageNo, setPageNo] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [selectedSortby, setSelectedSortby] = useState<Set<number>>(
    new Set<number>(),
  );

  useEffect(() => {
    if (props?.route?.params?._id) {
      setDocumentState([]);
      setPageNo(1);
      trigger(getBodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.route?.params?._id]);

  useEffect(() => {
    if (search.length) {
      setDocumentState([]);
      setPageNo(1);
    } else {
      setDocumentState([]);
      setPageNo(1);
    }
  }, [search]);

  const getBodyObj = useMemo(() => {
    return {
      searchText: search,
      pageNo: pageNo,
      companyId: companyId.map(ids => ids._id),
      sortBy:
        selectedSortby?.has(1) || selectedSortby.size === 0
          ? 'default'
          : 'AtoZ',
    };
  }, [search, pageNo, companyId, selectedSortby]);

  const [
    trigger,
    {
      data: myDocumentData,
      isLoading: isDocumentLoading,
      isSuccess: isDocumentSuccess,
    },
  ] = useGetRenewalMutation();

  const [documentState, setDocumentState] = useState<renewalInterface[]>([]);

  const [isPanelActive, setIsPanelActive] = useState(false);

  const [countFilter, setCountFilter] = useState<number>(1);

  useEffect(() => {
    if (selectedSortby.size === 0) {
      selectedSortby.add(1);
    }
  }, [selectedSortby]);

  useEffect(() => {
    trigger(getBodyObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getBodyObj]);

  useEffect(() => {
    if (refresh) {
      setDocumentState([]);
      trigger(getBodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, getBodyObj]);

  useEffect(() => {
    setPageNo(1);
    setDocumentState([]);
  }, [search, companyId, selectedSortby]);

  useEffect(() => {
    if (myDocumentData?.data?.nodes?.length && isDocumentSuccess) {
      setDocumentState(prev => prev.concat(myDocumentData?.data?.nodes));
    }
    setRefresh(false);
  }, [myDocumentData, isDocumentSuccess]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchText('');
        setPageNo(1);
      };
    }, []),
  );

  const viewDocument = (id: string) => {
    props.navigation.navigate({
      name: 'ViewDocument',
      params: {id},
    });
  };

  const renderLeftContainer = () => {
    return (
      <Stack horizontal verticalAlign="center">
        {/* <IconButton
          name="sync"
          size={24}
          color={colors.black}
          onPress={() => {
            setRefresh(true);
            setPageNo(1);
          }}
        /> */}
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('SelectCompany', {
              onGoBack: () => {
                setPageNo(1);
              },
            })
          }>
          <Stack horizontal verticalAlign="center">
            <TextView
              weight="medium"
              variant={FontSizes.medium}
              numberOfLines={1}
              style={styles.companyName}>
              {companyId?.length > 1
                ? t('addManager:allSelectedCompany')
                : companyId![0]?.name}
            </TextView>
            <Icon name="arrow_selection" size={24} color={colors.black} />
          </Stack>
        </TouchableOpacity>
        {tooltipSeen === 'false' || tooltipSeen === null ? (
          <ToolTip
            data={t('renewals:addRenewals')}
            icon="add_subtask"
            type="Renewal"
            onPress={val => setTooltipSeen(val)}
          />
        ) : (
          <IconButton
            name="add_subtask"
            size={24}
            color={colors.black}
            onPress={() => {
              props.navigation.navigate('CreateRenewals');
            }}
          />
        )}
      </Stack>
    );
  };

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const styles = Styles();

  return (
    <Container noSpacing>
      <Header
        hideLabel
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />

      <Stack
        spacing={20}
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center">
        <TextView weight="semibold" variant={FontSizes.xlarge}>
          {t('renewals:renewals')}
        </TextView>
        <Stack>
          <FilterIcon
            count={countFilter}
            onPress={() => {
              openPanel();
              props.navigation.setOptions({
                tabBarStyle: {
                  height: 0,
                },
              });
            }}
          />
        </Stack>
      </Stack>
      <Stack spacing={16} style={styles.attachmentView}>
        <SearchTextField
          setSearchValue={val => {
            setSearchText(val.trim());
          }}
          pattern1={searchPattern1}
          pattern2={searchPattern2}
        />
      </Stack>
      <Stack spacing={16} spaceBelow={16}>
        <RenewalsList
          onScrollHandler={scrollHandler}
          data={documentState}
          dataLength={myDocumentData?.data.nodes.length}
          stateDataLength={documentState.length}
          isLoading={pageNo > 1 && isDocumentLoading}
          setPageNo={() => {
            if (myDocumentData?.data.pageInfo.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          onRefresh={() => {
            setRefresh(true);
            setPageNo(1);
          }}
          isSuccess={isDocumentSuccess}
          onPress={id => {
            viewDocument(id);
          }}
        />
      </Stack>
      {isPanelActive && (
        <RenewalsBottomPanelModal
          panelState={isPanelActive}
          onPressClose={closePanel}
          props={props}
          filterCount={val => setCountFilter(val)}
          onSelectSort={val => setSelectedSortby(val)}
          selectedSort={selectedSortby}
        />
      )}
      {isDocumentLoading && pageNo === 1 && !search.length && <Loader />}
    </Container>
  );
};
