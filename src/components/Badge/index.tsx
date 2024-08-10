import {colors} from 'common/theme/colors';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {UploadedFileModal} from 'screens/AddTask';
import BadgeItem from './Components/BadgeItem';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-vector-icons/Icon';
import {useNavigation} from '@react-navigation/core';

interface BadgeModal {
  uploadedFiles: UploadedFileModal[] | undefined;
  onRemove: (index: number) => void;
}
const Badge: React.FC<BadgeModal> = ({uploadedFiles, onRemove}) => {
  const [visible, setIsVisible] = useState(false);
  const [imageData, setImageData] = useState<ImageSource[]>([]);
  const navigation = useNavigation();
  const onClick = (selectedItem: UploadedFileModal) => {
    if (selectedItem.type === 'application/pdf') {
      navigation.navigate('ViewPDF', {
        data: selectedItem.uri,
      });
    } else {
      setImageData([{uri: selectedItem.uri}]);
      setIsVisible(true);
    }
  };
  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {uploadedFiles && uploadedFiles.length > 0 && (
          <StackItem childrenGap={5} style={styles.scrollViewContainer}>
            <Stack horizontal>
              {uploadedFiles?.map((item, index) => {
                return (
                  ((index % 2 === 0 && index !== 2) || index === 1) && (
                    <BadgeItem
                      item={item}
                      index={index}
                      onRemove={idx => onRemove(idx)}
                      onClick={selectedItem => onClick(selectedItem)}
                    />
                  )
                );
              })}
            </Stack>
            <Stack horizontal>
              {uploadedFiles?.map((item, index) => {
                return (
                  ((index % 2 !== 0 && index !== 1) || index === 2) && (
                    <BadgeItem
                      item={item}
                      index={index}
                      onRemove={idx => onRemove(idx)}
                      onClick={selectedItem => onClick(selectedItem)}
                    />
                  )
                );
              })}
            </Stack>
          </StackItem>
        )}
      </ScrollView>
      <ImageView
        images={imageData}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </>
  );
};
export default Badge;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.grey_009,
    padding: 8,
    paddingRight: 8,
    borderRadius: 3,
  },
  scrollViewContainer: {
    backgroundColor: colors.white,
    padding: 8,
  },
  textStyle: {color: colors.black},
});
