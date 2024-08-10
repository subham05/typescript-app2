import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {DefaultButton, PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import {useSharedValue} from 'react-native-reanimated';
import {useLazyGetSingleDocumentQuery} from 'request/DocumentRepository';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ViewFile'>;
export const ViewFileScreen = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const {route, navigation} = props;
  const {params} = route;
  const [, setUserType] = useState<string | null | undefined>('');

  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });

  const [isVisible, setIsVisible] = useState(false);

  const [trigger, {currentData: myDocumentData, isLoading: isDocumentLoading}] =
    useLazyGetSingleDocumentQuery();
  //**Temporary fix to show file name */
  // useFocusEffect(
  //   useCallback(() => {
  //     if (params.id) {
  //       trigger(params.id);
  //       console.log('calling', params.id);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [params.id]),
  // );
  useEffect(() => {
    if (params.id) {
      trigger(params.id);
    }
  }, [params.id, trigger]);

  const styles = Styles();
  const renderHeader = () => (
    <StackItem horizontal horizontalAlign="flex-start" childrenGap={15}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('InviteMember', {
            edit: false,
            isShare: true,
            documentId: myDocumentData?.data._id,
          })
        }>
        <Icon name="share" size={25} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CreateDocument', {
            edit: true,
            DocData: myDocumentData?.data,
            attachment: myDocumentData?.data?.attachment ? true : false,
          })
        }>
        <Icon name="edit" size={25} />
      </TouchableOpacity>
    </StackItem>
  );
  return (
    <Container noSpacing>
      <Header
        label={t('document:viewFile')}
        navigationType="STACK"
        translateY={translateY}
        RenderPrivateToggle={params.isShared ? undefined : renderHeader}
        labelVieStyle={{width: Dimensions.get('screen').width - 35}}
      />
      <ScrollView>
        <StackItem childrenGap={16} spacing={16} spaceBelow={16}>
          <TextField
            label={t('document:title')}
            onChangeText={() => {}}
            value={myDocumentData?.data.title}
            editable={false}
            multiline={true}
          />
          {/* <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('document:taskName')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.input}>
          Landing page redesign
        </TextView> */}

          <TextField
            label={t('document:description')}
            onChangeText={() => {}}
            value={myDocumentData?.data.description}
            editable={false}
            multiline
            numberOfLines={4}
          />
          {myDocumentData?.data?.attachment?.url !== undefined && (
            <Stack>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.label}>
                {t('document:attachment')}
              </TextView>
              <ImageView
                images={[{uri: myDocumentData?.data?.attachment.url}]}
                imageIndex={0}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
              />
              <Stack horizontal style={styles.attachmentView}>
                <Stack horizontal style={styles.attachment}>
                  <Icon
                    name="photo_gallary"
                    size={22}
                    style={styles.attachmentIcon}
                  />
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    // truncate
                    style={styles.attachmentName}>
                    {/* {decodeURIComponent(myDocumentData?.data?.attachment?.url)
                      .split('/')
                      .pop() || ''} */}
                    {/* {myDocumentData?.data?.attachment?.url} */}
                    {myDocumentData?.data?.attachment?.documentFileExt!
                      ? `image.${myDocumentData?.data?.attachment
                          ?.documentFileExt!}`
                      : `image.${decodeURIComponent(
                          myDocumentData?.data?.attachment?.documentFileName!,
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
                    setIsVisible(true);
                    // myDocumentData.data.attachment.type === 'Image'
                    //   ? setIsVisible(true)
                    //   : props.navigation.navigate('ViewPDF', {
                    //       data: myDocumentData?.data?.attachment?.url,
                    //     });
                  }}
                />
                {/* <IconButton
                  name="visibility"
                  size={22}
                  style={styles.downloadIcon}
                  color={colors.black}
                  onPress={() => {
                    setIsVisible(true);
                  }}
                /> */}
              </Stack>
            </Stack>
          )}
        </StackItem>
      </ScrollView>
      <Stack>
        <Stack spacing={16} horizontal horizontalAlign="space-between" center>
          <PrimaryButton
            title={t('document:createTask')}
            onPress={() => {
              navigation.navigate('AddTask', {
                docData: myDocumentData,
              });
            }}
            style={styles.saveButton}
          />
          <DefaultButton
            title={t('accessLogs')}
            fontSize={FontSizes.small}
            onPress={() => {
              navigation.navigate('AccessLogs', {
                documentId: myDocumentData?.data._id,
                isShareWithMe: false,
              });
            }}
            style={styles.addMoreButton}
          />
        </Stack>
      </Stack>
      {isDocumentLoading && <Loader />}
    </Container>
  );
};
