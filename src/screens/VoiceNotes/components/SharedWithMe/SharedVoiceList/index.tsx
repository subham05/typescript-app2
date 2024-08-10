import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {VoiceNoteProps} from 'screens/VoiceNotes';
import {SharedVoiceItem, SharedVoiceNotesModel} from '../SharedVoiceItem';

interface VoiceNotesListProps {
  data: SharedVoiceNotesModel[];
  VoiceNoteListProps: VoiceNoteProps;
}
export const SharedVoiceList: React.FC<VoiceNotesListProps> = ({
  data,
  VoiceNoteListProps,
}) => {
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <SharedVoiceItem
            data={item}
            VoiceNoteItemProps={VoiceNoteListProps}
          />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => <FooterComponent />}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
  });
  return mergeStyles;
};
