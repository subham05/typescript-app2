import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {imageSources} from 'assets/images';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {DatePicker} from 'components/DatePicker';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import {useSharedValue} from 'react-native-reanimated';
import {RenewalsData, useLazyGetSingleRenewalQuery} from 'request/Renewals';
import {Styles} from './index.styles';
import {previewXlsx} from 'common/utils/XlsDownload';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ViewDocument'>;
export const ViewDocumentScreen = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);

  const [, setUserType] = useState<string | null | undefined>('');

  const [data, setData] = useState<RenewalsData>();

  const [imageData, setImageData] = useState<ImageSource[]>([]);

  const [visible, setIsVisible] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);

  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });

  const [
    trigger,
    {
      currentData: myDocumentData,
      // error: myDocumentError,
      // isError: isDocumentError,
      isLoading: isDocumentLoading,
      // isSuccess: isDocumentSuccess,
    },
  ] = useLazyGetSingleRenewalQuery();

  useEffect(() => {
    if (props.route.params.id) {
      trigger(props.route.params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.route.params.id]);

  useEffect(() => {
    setData(myDocumentData?.data);

    console.log('first', myDocumentData?.data);
  }, [myDocumentData?.data]);
  useEffect(() => {
    if (myDocumentData?.data?.attachment?.length > 0) {
      myDocumentData?.data.attachment.map(item => {
        imageData?.push({uri: item.url});
      });
      setImageData(imageData);
    }
  }, [myDocumentData?.data, data, imageData]);

  const handlePress = async (
    index: number,
    item: string,
    isPng: boolean,
    isXls: boolean,
  ) => {
    setImageIndex(index);
    if (isPng) {
      setIsVisible(true);
    } else if (isXls) {
      previewXlsx(item);
    } else {
      props.navigation.navigate('ViewPDF', {
        data: item,
      });
    }
  };

  const styles = Styles();

  const renderLeftContainer = () => {
    return (
      <Stack>
        <IconButton
          name="edit"
          size={24}
          color={colors.black}
          onPress={() => {
            props.navigation.navigate({
              name: 'EditRenewals',
              params: {id: props.route.params.id},
            });
          }}
        />
      </Stack>
    );
  };

  return (
    <Container noSpacing>
      <Header
        label={t('renewals:viewDocument')}
        navigationType="STACK"
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      <ScrollView>
        <StackItem childrenGap={16} spacing={16} spaceBelow={16}>
          <TextField
            label={t('renewals:name')}
            onChangeText={() => {}}
            value={myDocumentData?.data.companyId.name}
            editable={false}
          />
          <TextField
            label={t('renewals:name')}
            onChangeText={() => {}}
            value={myDocumentData?.data.name}
            editable={false}
          />
          <TextField
            label={t('renewals:type')}
            onChangeText={() => {}}
            value={myDocumentData?.data.documentCategory}
            editable={false}
          />
          {myDocumentData?.data.documentCategory === 'Other' && (
            <TextField
              label={t('renewals:title')}
              onChangeText={() => {}}
              value={myDocumentData?.data.title}
              editable={false}
            />
          )}
          <DatePicker
            label={t('renewals:registrationDate')}
            placeholder={'YYYY-MM-DD'}
            format={'YYYY-MM-DD'}
            minimumDate={new Date()}
            value={myDocumentData?.data.registrationDate}
            disabled
          />
          <DatePicker
            label={t('renewals:expiryDate')}
            placeholder={'YYYY-MM-DD'}
            format={'YYYY-MM-DD'}
            minimumDate={new Date()}
            value={
              !myDocumentData?.data.isNotExpiry
                ? myDocumentData?.data.expiryDate
                : 'NA'
            }
            disabled
          />
          <StackItem childrenGap={5}>
            <TextView
              variant={FontSizes.regular}
              style={[{color: colors.primary_003}, styles.rtlView]}>
              {t('renewals:attachment')}
            </TextView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.openBox}>
              <FlatList
                key={Math.random()}
                // horizontal
                numColumns={Math.round(
                  myDocumentData?.data?.attachment?.length / 2,
                )}
                data={myDocumentData?.data.attachment}
                renderItem={({item, index}) => {
                  console.log(item.type);
                  let isPng =
                    item?.url?.split('.').pop()?.toLowerCase() === 'png' ||
                    item?.url?.split('.').pop()?.toLowerCase() === 'jpg' ||
                    item?.url?.split('.').pop()?.toLowerCase() === 'jpeg' ||
                    item?.url?.split('.').pop()?.toLowerCase() === 'heic';
                  let isXls =
                    item?.url?.split('.').pop()?.toLowerCase() === 'xls' ||
                    item?.url?.split('.').pop()?.toLowerCase() === 'xlsx';
                  return (
                    <Stack
                      horizontal
                      style={styles.attachmentView}
                      key={index.toString()}>
                      <Stack
                        horizontal
                        style={{backgroundColor: colors.grey_009}}>
                        <Stack horizontal style={styles.attachment}>
                          {item.type === 'image' ? (
                            <Icon
                              name="photo_gallary"
                              size={18}
                              style={styles.attachmentIcon}
                              color={colors.black}
                            />
                          ) : isXls ? (
                            <Image
                              source={imageSources.excelFile}
                              style={styles.pdfIcon}
                            />
                          ) : (
                            <Image
                              source={imageSources.pdfFile}
                              style={styles.pdfIcon}
                            />
                          )}
                          <TextView
                            weight="regular"
                            variant={FontSizes.regular}
                            style={styles.attachmentName}
                            truncate>
                            {/* {decodeURIComponent(item.url).split('/').pop()} */}
                            {item.type?.includes('image')
                              ? item.renewalsFileExt!
                                ? `image.${item.renewalsFileExt!}`
                                : `image.${decodeURIComponent(
                                    item.renewalsFileName!,
                                  )
                                    .split('.')
                                    .pop()}`
                              : item.type?.includes('excel')
                              ? item.renewalsFileExt!
                                ? `file.${item.renewalsFileExt!}`
                                : `file.${decodeURIComponent(
                                    item.renewalsFileName!,
                                  )
                                    .split('.')
                                    .pop()}`
                              : item.renewalsFileExt!
                              ? `file.${item.renewalsFileExt!}`
                              : `file.${decodeURIComponent(
                                  item.renewalsFileName!,
                                )
                                  .split('.')
                                  .pop()}`}
                          </TextView>
                        </Stack>
                        <IconButton
                          name="visibility"
                          size={18}
                          color={colors.black}
                          style={styles.downloadIcon}
                          onPress={() => {
                            handlePress(index, item?.url, isPng, isXls);
                            // setImageIndex(index);
                            // item.type === 'image'
                            //   ? setIsVisible(true)
                            //   : props.navigation.navigate('ViewPDF', {
                            //       data: item.url,
                            //     });
                          }}
                        />
                      </Stack>
                      <ImageView
                        keyExtractor={(_, indexKey) => indexKey.toString()}
                        images={imageData}
                        imageIndex={imageIndex}
                        visible={visible}
                        onRequestClose={() => setIsVisible(false)}
                      />
                    </Stack>
                  );
                }}
                keyExtractor={(_, index) => index.toString()}
                ListEmptyComponent={
                  <Stack center style={styles.dataNotFound}>
                    <TextView
                      variant={FontSizes.regular}
                      weight={'medium'}
                      style={styles.rtlView}>
                      No attachment found
                    </TextView>
                  </Stack>
                }
                style={styles.flatList}
              />
            </ScrollView>
          </StackItem>
        </StackItem>
      </ScrollView>
      <Stack>
        <Stack spacing={16} horizontal horizontalAlign="space-between" center>
          {/* <PrimaryButton
            title={t('document:assign')}
            onPress={() => {
              props.navigation.navigate('AddTask', {subTask: true});
            }}
            style={styles.saveButton}
          /> */}
          {/* <DefaultButton
            title={t('accessLogs')}
            fontSize={FontSizes.small}
            onPress={() => {
              props.navigation.navigate('AccessLogs');
            }}
            style={styles.addMoreButton}
          /> */}
        </Stack>
      </Stack>
      {isDocumentLoading && <Loader />}
    </Container>
  );
};
