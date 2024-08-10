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
import {IconButton} from 'components/IconButtons';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import {t} from 'i18next';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {ImageLibraryOptions, launchCamera} from 'react-native-image-picker';
import {useSharedValue} from 'react-native-reanimated';

let modalOpen = false;

const suggestions = [
  {id: '1', name: 'All'},
  {id: '2', name: 'Esther Howard'},
  {id: '3', name: 'Kristin Watson'},
  {id: '4', name: 'Jenny Wilson'},
  {id: '5', name: 'Leslie Alexander'},
];

type Props = NativeStackScreenProps<SignedInStackParamList, 'ChattingScreen'>;
export const ChattingScreen = (props: Props) => {
  const translateY = useSharedValue(0);

  // const [value, setValue] = useState('Hello @[Esther Howard](2)! How are you?');
  const {type, data} = props.route.params!;
  const [mentionModal, setMentionModal] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  // const [keyword, setKeyword] = useState<string>('');
  // const [image,setImage] = useState<string | undefined>('');

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
          // const source = response.uri;
          // setImage(source);
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
                image={data?.image}
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
            onPress={
              () => {}
              // props.navigation.navigate('ViewGroup', {data: data})
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
                image={data?.image}
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
      <ScrollView />
      {mentionModal && (
        <ScrollView style={styles().suggestionBox}>
          {suggestions
            .filter(
              one => one.name.toLocaleLowerCase(),
              // .includes(keyword.toLocaleLowerCase()),
            )
            .map(one => (
              <Pressable
                key={one.id}
                onPress={() => {
                  setText(prevText => prevText + one.name);
                  setMentionModal(false);
                }}
                style={styles().pressableOption}>
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles().headName}>
                  {one.name}
                </TextView>
                {/* <Text>{one.name}</Text> */}
              </Pressable>
            ))}
        </ScrollView>
      )}
      <Stack
        horizontal
        style={styles().renderInputToolBar}
        verticalAlign="center">
        <IconButton
          name="mic"
          size={24}
          color={colors.primary_003}
          style={styles().mic}
          onPress={() => {}}
        />
        <TextInput
          placeholder={'Type message...'}
          onChangeText={value => {
            setText(value);
            if (value.toString().slice(-2) === ' @') {
              setMentionModal(true);
              // setKeyword(value.toString().slice(-1));
            }
            // else if (
            //   mentionModal &&
            //   value.toString().slice(-2) === '${%d}${%d}'
            // ) {
            //   setMentionModal(true);
            // }
            else {
              setMentionModal(false);
            }
          }}
          // value={text}
          style={styles().TextInput}>
          {text}
        </TextInput>
        <IconButton
          name="camera"
          size={24}
          color={colors.primary_003}
          style={styles().iconsBottom}
          onPress={() => {
            takePermissionCamera();
          }}
        />
        <IconButton
          name="attach_file"
          size={24}
          color={colors.primary_003}
          style={styles().iconsBottom}
          onPress={() => {}}
        />
        {/* <Send {...props}> */}
        {/* <Icon name="send" size={24} color={colors.primary} /> */}
        {/* </Send> */}
      </Stack>
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
      backgroundColor: modalOpen ? colors.grey_001 : colors.white,
      // maxHeight: 40,
      height: 40,
      width: '90%',
      // alignItems: 'center',
      // alignSelf: 'center',
      marginLeft: 10,
      marginBottom: 10,
    },
    mic: {
      marginLeft: 10,
      backgroundColor: modalOpen ? colors.white : '',
      padding: modalOpen ? 10 : 0,
      // marginBottom: 10,
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
      marginLeft: modalOpen ? 0 : 10,
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
      // marginBottom: 10,
      marginRight: modalOpen ? 0 : 10,
      backgroundColor: modalOpen ? colors.white : '',
      padding: modalOpen ? 10 : 0,
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
    suggestionBox: {
      backgroundColor: colors.white,
      width: '53%',
      marginLeft: '12%',
      maxHeight: 200,
    },
    pressableOption: {padding: 12},
  });
  return shareStyles;
};
