import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkCameraPermission,
  getCameraPermission,
} from 'common/utils/permission/ReadCamera';
import {Container, TextView} from 'components';
import {Divider} from 'components/Divider';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import {t} from 'i18next';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import {ImageLibraryOptions, launchCamera} from 'react-native-image-picker';
import {useSharedValue} from 'react-native-reanimated';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ChattingScreen'>;
export const ChattingScreen = (props: Props) => {
  const translateY = useSharedValue(0);

  const {type, data} = props.route.params!;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messages, setMessages] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [image, setImage] = useState<string | undefined>('');
  useEffect(() => {
    setMessages([
      {
        _id: '1',
        text: 'Hello developer. How are you? Hope you are doing well. Thank you',
        createdAt: `${new Date()}`,
        user: {
          _id: 2,
          name: data?.name,
          avatar: data?.profileUrl,
        },
      },
      {
        _id: '2',
        text: 'Hello developer. How are you? Hope you are doing well. Thank you',
        image:
          'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY',
        createdAt: `${new Date()}`,
        user: {
          _id: 2,
          name: data?.name,
          avatar: data?.profileUrl,
        },
      },
      {
        _id: '3',
        text: 'File.pdf',
        createdAt: `${new Date()}`,
        user: {
          _id: 2,
          name: data?.name,
          avatar: data?.profileUrl,
        },
      },
    ]);
  }, [data]);

  const chooseFileCamera = () => {
    if (true) {
      let option: ImageLibraryOptions = {
        mediaType: 'photo',
      };
      // var options = {
      //   noData: true,
      //   title: 'Select Image',
      //   maxWidth: 300,
      //   maxHeight: 300,
      //   customButtons: [
      //     {
      //       name: 'customOptionKey',
      //       title: '',
      //     },
      //   ],
      //   storageOptions: {
      //     path: 'images',
      //   },
      //   option,
      // };

      launchCamera(option, response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          if (response.errorCode === 'permission') {
            // moveToDeviceSettings();
          }
        }
        // else if (response.customButton) {
        //   Alert.alert(response.customButton);
        // }
        else {
          const source = response?.assets![0].uri;
          setImage(source);
          // this.setState({
          //   filePath: response,
          //   fileData: response.data,
          //   fileUri: response.uri
          // });
        }
      });
    }
  };

  const takePermissionCamera = () => {
    checkCameraPermission().then(res => {
      if (!res.isPermissionGranted) {
        if (res.result === 'denied') {
          getCameraPermission().then(resp => {
            const {statuses, isPermissionGranted} = resp;
            (statuses['ios.permission.CAMERA'] === 'blocked' ||
              statuses['android.permission.CAMERA'] === 'blocked') &&
              AlertPermission(t('permissions:camera'));
            isPermissionGranted && chooseFileCamera();
          });
        } else if (res.result === 'blocked') {
          AlertPermission(t('permissions:camera'));
        }
      } else {
        chooseFileCamera();
      }
    });
  };

  // const showPdf = async () => {
  //   const {uri, width, height} = await PdfThumbnail.generate(
  //     'https://www.clickdimensions.com/links/TestPDFfile.pdf',
  //     0,
  //   );
  //   // const results = await PdfThumbnail.generateAllPages(
  //   //   'https://www.clickdimensions.com/links/TestPDFfile.pdf',
  //   // );

  // };

  // function renderBubble(prop: any) {
  //   return (
  //     <>
  //       {prop.position === 'left' ? (
  //         <Stack style={styles().bubble}>
  //           <Stack horizontal>
  //             <TextView
  //               weight="regular"
  //               variant={FontSizes.xSmall}
  //               style={styles().nameTime}>
  //               {prop.currentMessage.user.name},{' '}
  //             </TextView>
  //             <TextView
  //               weight="regular"
  //               variant={FontSizes.xSmall}
  //               style={styles().nameTime}>
  //               {/* {moment(props.currentMessage.createdAt).format('hh:mm A')} */}
  //               12:15 PM
  //             </TextView>
  //           </Stack>
  //           <Stack style={styles().textViewLeft} center>
  //             {prop.currentMessage.image ? (
  //               <Image
  //                 source={{uri: prop.currentMessage.image}}
  //                 style={styles().receiverImage}
  //               />
  //             ) : (
  //               // ) : prop.currentMessage.text.substring(
  //               //     prop.currentMessage.text.lastIndexOf('.') + 1,
  //               //   ) === 'pdf' ? (
  //               //   <TextView
  //               //     weight="regular"
  //               //     variant={FontSizes.small}
  //               //     style={styles().text}>
  //               //     Pdf
  //               //   </TextView>
  //               // ) : prop.currentMessage.text.substring(
  //               //     prop.currentMessage.text.lastIndexOf('.') + 1,
  //               //   ) === 'docx' ? (
  //               //   <Stack style={styles().docxView}>
  //               //     <Stack style={styles().docxFileName}>
  //               //       <StackItem
  //               //         horizontal
  //               //         childrenGap={5}
  //               //         verticalAlign="center">
  //               //         <Icon
  //               //           name="text_snippet"
  //               //           size={24}
  //               //           color={colors.blue_001}
  //               //         />
  //               //         <TextView
  //               //           weight="regular"
  //               //           variant={FontSizes.small}
  //               //           truncate>
  //               //           Word document file name name
  //               //         </TextView>
  //               //       </StackItem>
  //               //     </Stack>
  //               //     <Stack
  //               //       horizontal
  //               //       horizontalAlign="space-between"
  //               //       verticalAlign="center">
  //               //       <StackItem
  //               //         horizontal
  //               //         childrenGap={5}
  //               //         verticalAlign="center">
  //               //         <TextView
  //               //           weight="regular"
  //               //           variant={FontSizes.xxSmall}
  //               //           style={styles().receiverFileSize}>
  //               //           409 KB
  //               //         </TextView>
  //               //         <View style={styles().dot} />
  //               //         <TextView
  //               //           weight="regular"
  //               //           variant={FontSizes.xxSmall}
  //               //           style={styles().receiverFileSize}>
  //               //           DOCX
  //               //         </TextView>
  //               //       </StackItem>
  //               //       <StackItem horizontal childrenGap={0}>
  //               //         <TextView
  //               //           weight="regular"
  //               //           variant={FontSizes.xxSmall}
  //               //           style={styles().receiverFileSize}>
  //               //           12:10 AM
  //               //         </TextView>
  //               //         <Icon
  //               //           name="sent_tick"
  //               //           size={16}
  //               //           color={colors.primary}
  //               //           style={styles().tickIcon}
  //               //         />
  //               //       </StackItem>
  //               //     </Stack>
  //               //   </Stack>
  //               <TextView
  //                 weight="regular"
  //                 variant={FontSizes.small}
  //                 style={styles().text}>
  //                 {prop.currentMessage.text}
  //               </TextView>
  //             )}
  //           </Stack>
  //         </Stack>
  //       ) : (
  //         <Stack style={styles().bubble}>
  //           <Stack style={styles().textViewRight} horizontal>
  //             {prop.currentMessage.image ? (
  //               <Image
  //                 source={{uri: prop.currentMessage.image}}
  //                 style={styles().senderImage}
  //               />
  //             ) : prop.currentMessage.text.substring(
  //                 prop.currentMessage.text.lastIndexOf('.') + 1,
  //               ) === 'docx' ? (
  //               <Stack style={styles().docxView}>
  //                 <Stack style={styles().docxFileName}>
  //                   <StackItem
  //                     horizontal
  //                     childrenGap={2}
  //                     verticalAlign="center">
  //                     <Icon
  //                       name="text_snippet"
  //                       size={24}
  //                       color={colors.blue_001}
  //                     />
  //                     <TextView
  //                       weight="regular"
  //                       variant={FontSizes.small}
  //                       truncate>
  //                       Word document file name name
  //                     </TextView>
  //                   </StackItem>
  //                 </Stack>
  //                 <Stack
  //                   horizontal
  //                   horizontalAlign="space-between"
  //                   verticalAlign="center"
  //                   style={styles().docxFooter}>
  //                   <StackItem
  //                     horizontal
  //                     childrenGap={5}
  //                     verticalAlign="center">
  //                     <TextView
  //                       weight="regular"
  //                       variant={FontSizes.xxSmall}
  //                       style={styles().receiverFileSize}>
  //                       409 KB
  //                     </TextView>
  //                     <View style={styles().dot} />
  //                     <TextView
  //                       weight="regular"
  //                       variant={FontSizes.xxSmall}
  //                       style={styles().receiverFileSize}>
  //                       DOCX
  //                     </TextView>
  //                   </StackItem>
  //                   <StackItem horizontal childrenGap={0}>
  //                     <TextView
  //                       weight="regular"
  //                       variant={FontSizes.xxSmall}
  //                       style={styles().receiverFileSize}>
  //                       12:10 AM
  //                     </TextView>
  //                     <Icon
  //                       name="sent_tick"
  //                       size={16}
  //                       color={colors.primary}
  //                       style={styles().tickIcon}
  //                     />
  //                   </StackItem>
  //                 </Stack>
  //               </Stack>
  //             ) : (
  //               // ) : prop.currentMessage.text.substring(
  //               //     prop.currentMessage.text.lastIndexOf('.') + 1,
  //               //   ) !== 'pdf' ? (
  //               //   <TextView
  //               //     weight="regular"
  //               //     variant={FontSizes.small}
  //               //     style={styles().text}>
  //               //     pdf
  //               //   </TextView>
  //               <TextView
  //                 weight="regular"
  //                 variant={FontSizes.small}
  //                 style={styles().text}>
  //                 {prop.currentMessage.text}
  //               </TextView>
  //             )}
  //             {prop.currentMessage.text.substring(
  //               prop.currentMessage.text.lastIndexOf('.') + 1,
  //             ) !== 'docx' && (
  //               <Stack
  //                 horizontal
  //                 verticalAlign="flex-end"
  //                 style={styles().timeTick}>
  //                 <TextView
  //                   weight="regular"
  //                   variant={FontSizes.xSmall}
  //                   style={styles().nameTime}>
  //                   {/* {moment(props.currentMessage.createdAt).format('hh:mm A')} */}
  //                   12:15 PM
  //                 </TextView>
  //                 <Icon
  //                   name="sent_tick"
  //                   size={16}
  //                   color={colors.primary}
  //                   style={styles().tickIcon}
  //                 />
  //               </Stack>
  //             )}
  //           </Stack>
  //           {/* <Stack horizontal style={styles().timeTickView}>
  //             <TextView
  //               weight="regular"
  //               variant={FontSizes.xSmall}
  //               style={styles().nameTime}>
  //               {moment(props.currentMessage.createdAt).format('hh:mm A')}
  //               12:15 PM
  //             </TextView>
  //             <Icon
  //               name="sent_tick"
  //               size={20}
  //               color={colors.primary}
  //               style={styles().tickIcon}
  //             />
  //           </Stack> */}
  //         </Stack>
  //       )}
  //     </>
  //   );
  // }

  // function renderBubble(prop: any) {
  //   return (
  //     <Bubble
  //       {...prop}
  //       // wrapperStyle={{
  //       //   left: {
  //       //     backgroundColor: colors.white,
  //       //   },
  //       //   right: {
  //       //     backgroundColor: colors.grey_008,
  //       //   },
  //       // }}
  //       // textStyle={{
  //       //   left: {
  //       //     color: colors.black,
  //       //     fontFamily: AppFonts.regular,
  //       //     fontSize: FontSizes.small,
  //       //   },
  //       //   right: {
  //       //     color: colors.black,
  //       //     fontFamily: AppFonts.regular,
  //       //     fontSize: FontSizes.small,
  //       //   },
  //       // }}
  //       // tickStyle={{
  //       //   color: prop.currentMessage.seen ? colors.primary : colors.grey_002,
  //       // }}
  //       // // usernameStyle={{color: colors.grey_003}}
  //       // renderTicks={renderTicks}
  //       // // renderTime={renderTime}
  //     >
  //       <View style={{backgroundColor: 'white'}}>
  //         <Text>{prop.currentMessage.createdAt}</Text>
  //         <Text>{prop.currentMessage.user.name}</Text>
  //       </View>
  //     </Bubble>
  //   );
  // }

  // const renderTicks = (currentMessage: any) => {
  //   return (
  //     <View>
  //       {!!currentMessage.sent &&
  //         !!currentMessage.received(
  //           <Icon name="sent_tick" size={24} color={colors.primary} />,
  //         )}
  //     </View>
  //   );
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function renderSend(prop: Send['props']) {
    return (
      <>
        <IconButton
          name="camera"
          size={24}
          color={colors.primary_003}
          style={styles().iconsBottom}
          onPress={() => {
            takePermissionCamera();
          }}
        />
        {/* <TouchableOpacity
          onPress={() => {
            chooseFileCamera();
          }}>
          <Icon
            name="camera"
            size={24}
            color={colors.primary_003}
            style={styles().iconsBottom}
          />
        </TouchableOpacity> */}
        <IconButton
          name="attach_file"
          size={24}
          color={colors.primary_003}
          style={styles().iconsBottom}
          onPress={() => {}}
        />
        {/* <TouchableOpacity onPress={() => {}}>
          <Icon
            name="attach_file"
            size={24}
            color={colors.primary_003}
            style={styles().iconsBottom}
          />
        </TouchableOpacity> */}
        <View style={styles().smallView} />
        <Send
          {...prop}
          onSend={() =>
            prop.onSend!(
              {
                text: prop.text,
              },
              true,
            )
          }>
          <Icon
            name="send"
            size={24}
            color={colors.white}
            style={styles().sendIcon}
          />
        </Send>
        <View style={styles().view} />
      </>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderActions = () => {
    return (
      <>
        <View style={styles().view} />
        <IconButton
          name="mic"
          size={24}
          color={colors.primary_003}
          style={styles().mic}
          onPress={() => {}}
        />
      </>
      // <TouchableOpacity onPress={() => {}}>
      //   <Icon
      //     name="mic"
      //     size={24}
      //     color={colors.primary_003}
      //     style={styles().mic}
      //   />
      // </TouchableOpacity>
    );
  };

  // const renderDay = (renderDayProps: Day['props']) => {
  //   return <Day {...renderDayProps} textStyle={styles().renderDay} />;
  // };

  // function renderTime(prop: any) {
  //   return (
  //     <Time
  //       {...prop}
  //       timeTextStyle={{
  //         right: {
  //           color: colors.grey_003,
  //         },
  //         left: {
  //           color: colors.grey_003,
  //         },
  //       }}
  //       // containerStyle={{
  //       //   left: {
  //       //     // flex: 1,
  //       //     // width: '100%',
  //       //     backgroundColor: colors.grey_001,
  //       //   },
  //       //   right: {
  //       //     // flex: 1,
  //       //     // width: '100%',
  //       //     backgroundColor: colors.grey_001,
  //       //   },
  //       // }}
  //     />
  //   );
  // }

  // const renderComposer = (prop: Composer['props']) => {
  //   return (
  //     <Composer
  //       {...prop}
  //       onTextChanged={val => {
  //         setText(val);
  //       }}
  //       text={text}
  //     />
  //     // <>
  //     //   <TextInput
  //     //     placeholder={'Type message...'}
  //     //     onChangeText={value => setText(value)}
  //     //     value={text}
  //     //     style={styles().TextInput}
  //     //   />
  //     //   <Icon
  //     //     name="camera"
  //     //     size={24}
  //     //     color={colors.primary_003}
  //     //     style={styles().mic}
  //     //   />
  //     //   <Icon
  //     //     name="attach_file"
  //     //     size={24}
  //     //     color={colors.primary_003}
  //     //     style={styles().mic}
  //     //   />
  //     // </>
  //   );
  // };

  // const renderInputToolBar = () => {
  //   return (
  //     <Stack horizontal style={styles().renderInputToolBar}>
  //       <Icon
  //         name="mic"
  //         size={24}
  //         color={colors.primary_003}
  //         style={styles().mic}
  //       />
  //       <TextInput
  //         placeholder={'Type message...'}
  //         onChangeText={value => setText(value)}
  //         value={text}
  //         style={styles().TextInput}
  //       />
  //       <Icon
  //         name="camera"
  //         size={24}
  //         color={colors.primary_003}
  //         style={styles().mic}
  //       />
  //       <Icon
  //         name="attach_file"
  //         size={24}
  //         color={colors.primary_003}
  //         style={styles().mic}
  //       />
  //       <Send {...props}>
  //         <Icon name="send" size={24} color={colors.primary} />
  //       </Send>
  //     </Stack>
  //   );
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSend = useCallback((message = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, message),
    );
    setImage('');
  }, []);

  const renderMainContainer = () => {
    return (
      <Stack style={styles().header}>
        {type === 'People' ? (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('ViewContact', {data: data})
            }>
            <Stack horizontal>
              <Persona
                name={data?.name}
                image={data?.profileUrl}
                // image={'https://picsum.photos/200/300'}
              />
              <Stack style={styles().name}>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles().headName}>
                  {data?.name}
                </TextView>
              </Stack>
            </Stack>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('ViewGroup', {data: data})
            }>
            <Stack horizontal>
              {/* <Icon
                name="groups"
                size={24}
                color={colors.white}
                style={styles().groupIcon}
              /> */}
              <Persona
                name={data?.name}
                image={data?.profileUrl}
                style={styles().groupIcon}
                // image={'https://picsum.photos/200/300'}
              />
              <Stack style={styles().groupName}>
                <TextView weight="medium" variant={FontSizes.regular}>
                  {data?.name}
                </TextView>
                <TextView weight="regular" variant={FontSizes.small}>
                  7 Members
                </TextView>
              </Stack>
            </Stack>
          </TouchableOpacity>
        )}
      </Stack>
    );
  };
  const renderLeftContainer = () => {
    return (
      <Stack>
        {type === 'Groups' && (
          <IconButton
            name="add_member"
            size={24}
            color={colors.black}
            style={styles().headerTop}
            onPress={() => props.navigation.navigate('AddMember')}
          />
          // <TouchableOpacity
          //   onPress={() => props.navigation.navigate('AddMember')}>
          //   <Icon
          //     name="add_member"
          //     size={24}
          //     color={colors.black}
          //     style={styles().headerTop}
          //   />
          // </TouchableOpacity>
        )}
      </Stack>
    );
  };
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
        RenderLeftContainer={renderLeftContainer}
        disableDefaultStyle
      />
      <Stack style={styles().horizontalLine}>
        <Divider size={2} color={colors.grey_008} />
      </Stack>
      {/* <GiftedChat
        messages={messages}
        onSend={message =>
          onSend(
            image !== ''
              ? {
                  image: image,
                  _id: 3,
                  name: 'React Native',
                  avatar: 'https://picsum.photos/200/300',
                  user: {
                    _id: 3,
                    name: 'React Native',
                    avatar: 'https://picsum.photos/200/300',
                  },
                }
              : message,
          )
        }
        user={{
          _id: 3,
          name: 'React Native',
          avatar: 'https://picsum.photos/200/300',
        }}
        alwaysShowSend={true}
        showUserAvatar={true}
        renderUsernameOnMessage={true}
        renderBubble={renderBubble}
        renderAvatarOnTop={true}
        // renderTicks={(message: any) => renderTicks(message)}
        renderSend={renderSend}
        renderActions={() => renderActions()}
        renderDay={renderDay}
        dateFormat={'dddd; MMM DD, YYYY'}
        infiniteScroll
        // locale={dayjs}
        // renderTime={renderTime}
        // renderComposer={renderComposer}
        // renderInputToolbar={() => renderInputToolBar()}
      /> */}
    </Container>
  );
};

const styles = () => {
  const shareStyles = StyleSheet.create({
    bubble: {
      maxWidth: '50%',
      minWidth: '30%',
    },
    input: {
      height: 35,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
    },
    header: {
      marginTop: 10,
    },
    headerTop: {
      marginTop: 16,
      marginRight: 10,
    },
    groupIcon: {
      height: 40,
      width: 40,
      padding: 7,
      borderRadius: 20,
      backgroundColor: colors.primary_004,
      marginHorizontal: 10,
      marginTop: 5,
    },
    horizontalLine: {
      marginTop: 15,
    },
    name: {
      justifyContent: 'center',
    },
    renderInputToolBar: {
      backgroundColor: colors.white,
      height: 40,
      width: '80%',
      alignItems: 'center',
      marginLeft: 10,
      marginBottom: 10,
    },
    mic: {
      marginLeft: 10,
      marginBottom: 10,
    },
    view: {
      width: 16,
      height: '100%',
      backgroundColor: colors.grey_001,
      borderTopColor: colors.grey_001,
    },
    smallView: {
      width: 5,
      height: '100%',
      backgroundColor: colors.grey_001,
    },
    TextInput: {
      width: '58%',
      marginLeft: 10,
    },
    sendIcon: {
      // marginBottom: 10,
      backgroundColor: colors.primary,
      paddingLeft: 13,
      padding: 10,
      // marginRight: 7,
      borderRadius: 2,
      // marginBottom: 2,
      // borderRightWidth: 15,
      // borderRightColor: colors.grey_001,
    },
    iconsBottom: {
      marginBottom: 10,
      marginRight: 10,
    },
    nameTime: {
      color: colors.grey_003,
    },
    textViewLeft: {
      marginTop: 10,
      backgroundColor: colors.white,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    textViewRight: {
      marginBottom: 10,
      backgroundColor: colors.grey_008,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
    },
    text: {
      padding: 12,
      marginBottom: 3,
    },
    tickIcon: {
      marginLeft: 10,
      marginRight: 10,
    },
    headName: {
      marginLeft: 10,
    },
    timeTickView: {
      alignSelf: 'flex-end',
    },
    groupName: {marginLeft: 10, marginTop: 3},
    timeTick: {position: 'absolute', right: 0, bottom: 0, top: 5},
    renderDay: {
      color: colors.primary,
      fontSize: 14,
      fontFamily: AppFonts.regular,
    },
    receiverImage: {
      height: 158,
      width: 152,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
      borderWidth: 3,
      borderColor: colors.grey_008,
    },
    senderImage: {
      height: 158,
      width: 152,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
      borderWidth: 3,
      borderColor: colors.grey_008,
    },
    receiverFileSize: {color: colors.white},
    docxView: {
      height: 57,
      width: '110%',
      right: 20,
      backgroundColor: colors.grey_008,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
    },
    docxFileName: {
      height: 35,
      width: '90%',
      backgroundColor: colors.grey_013,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
      marginBottom: 3,
      marginTop: 5,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
    },
    dot: {
      height: 3,
      width: 3,
      borderRadius: 3,
      backgroundColor: colors.white,
    },
    docxFooter: {marginLeft: 10},
  });
  return shareStyles;
};
