import {colors} from 'common/theme/colors';
import {TextView} from 'components';
import {Stack} from 'components/Stack';
import React from 'react';
import {Image, ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {getPersonaInitialsColor} from './persona.initialColor';
import {getInitials} from './utils';
interface PersonaProps {
  name: string | undefined;
  size?: number;
  style?: StyleProp<ViewStyle>;
  image?: string;
  square?: boolean;
}

export const Persona: React.FC<PersonaProps> = ({
  name,
  image,
  size,
  square,
}) => {
  const PersonaSize = size ? size : 48;

  const containerStyle: ViewStyle = {
    backgroundColor: image ? colors.grey_008 : getPersonaInitialsColor(name!),
    borderRadius: square ? 0 : PersonaSize / 2,
    height: PersonaSize,
    width: PersonaSize,
    borderColor: 'transparent',
  };

  const imageStyle: ImageStyle = {
    height: PersonaSize,
    width: PersonaSize,
    borderRadius: PersonaSize / 2,
  };

  const fontStyles: TextStyle = {
    color: colors.white,
    fontSize: PersonaSize * 0.35,
  };

  return (
    <Stack center style={[containerStyle]}>
      {image?.includes('http') ? (
        <Image source={{uri: image}} style={imageStyle} />
      ) : (
        <TextView style={fontStyles} adjustsFontSizeToFit={true}>
          {getInitials(name!)}
        </TextView>
      )}
    </Stack>
  );
};
