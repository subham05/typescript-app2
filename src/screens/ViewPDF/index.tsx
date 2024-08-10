import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import {IconView} from 'components/Icon';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Pdf from 'react-native-pdf';
import {Stack} from 'stack-container';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ViewPDF'>;
export const ViewPDFScreen = (props: Props) => {
  const {route} = {...props};

  const {data} = {
    ...route.params,
  };
  const source = {
    uri: data,
    cache: true,
  };

  return (
    <Container noSpacing>
      <Stack style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <IconView
            name={'arrow_back'}
            style={{
              marginRight: Dimensions.get('screen').width / 1,
            }}
          />
        </TouchableOpacity>
        <View style={styles.pdfView}>
          <Pdf
            trustAllCerts={false}
            source={source}
            onLoadComplete={() => {}}
            onPageChanged={() => {}}
            onError={() => {}}
            onPressLink={() => {}}
            style={styles.pdf}
          />
        </View>
      </Stack>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  backButton: {marginTop: 10, paddingLeft: 10},
  pdfView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
