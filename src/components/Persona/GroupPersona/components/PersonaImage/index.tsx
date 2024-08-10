import {colors} from 'common/theme/colors';
import {Persona} from 'components/Persona';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AssigneeInterface} from '../..';

interface PersonaImageProps {
  data: AssigneeInterface[];
}

export const PersonaImage: React.FC<PersonaImageProps> = ({data}) => {
  return (
    <>
      {data?.map((item, index) => {
        return (
          <View key={index.toString()} style={styles().image}>
            <Persona
              name={item?.name}
              image={item?.profileUrl ? item?.profileUrl : undefined}
              size={20}
            />
          </View>
        );
      })}
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    image: {
      height: 22,
      width: 22,
      borderRadius: 22,
      marginRight: -5,
      borderWidth: 1.5,
      borderColor: colors.grey_011,
    },
  });
  return mergeStyles;
};
