import {PersonaInitialsColor} from './constants';
import {COLOR_SWATCHES_LOOKUP} from './constants';

var COLOR_SWATCHES_NUM_ENTRIES = COLOR_SWATCHES_LOOKUP.length;
function getInitialsColorFromName(displayName: string) {
  var color = PersonaInitialsColor.blue;
  if (!displayName) {
    return color;
  }
  var hashCode = 0;
  for (var iLen = displayName.length - 1; iLen >= 0; iLen--) {
    var ch = displayName.charCodeAt(iLen);
    var shift = iLen % 8;
    // eslint-disable-next-line no-bitwise
    hashCode ^= (ch << shift) + (ch >> (8 - shift));
  }
  color = COLOR_SWATCHES_LOOKUP[hashCode % COLOR_SWATCHES_NUM_ENTRIES];
  return color;
}
function personaInitialsColorToHexCode(personaInitialsColor: number) {
  switch (personaInitialsColor) {
    case PersonaInitialsColor.lightBlue:
      return '#4F6BED';
    case PersonaInitialsColor.blue:
      return '#0078D4';
    case PersonaInitialsColor.darkBlue:
      return '#004E8C';
    case PersonaInitialsColor.teal:
      return '#038387';
    case PersonaInitialsColor.lightGreen:
    case PersonaInitialsColor.green:
      return '#498205';
    case PersonaInitialsColor.darkGreen:
      return '#0B6A0B';
    case PersonaInitialsColor.lightPink:
      return '#C239B3';
    case PersonaInitialsColor.pink:
      return '#E3008C';
    case PersonaInitialsColor.magenta:
      return '#881798';
    case PersonaInitialsColor.purple:
      return '#5C2E91';
    case PersonaInitialsColor.orange:
      return '#CA5010';
    case PersonaInitialsColor.red:
      return '#EE1111';
    case PersonaInitialsColor.lightRed:
      return '#D13438';
    case PersonaInitialsColor.darkRed:
      return '#A4262C';
    case PersonaInitialsColor.transparent:
      return 'transparent';
    case PersonaInitialsColor.violet:
      return '#8764B8';
    case PersonaInitialsColor.gold:
      return '#986F0B';
    case PersonaInitialsColor.burgundy:
      return '#750B1C';
    case PersonaInitialsColor.warmGray:
      return '#7A7574';
    case PersonaInitialsColor.cyan:
      return '#005B70';
    case PersonaInitialsColor.rust:
      return '#8E562E';
    case PersonaInitialsColor.coolGray:
      return '#69797E';
    case PersonaInitialsColor.black:
      return '#1D1D1D';
    case PersonaInitialsColor.gray:
      return '#393939';
  }
}

/**
 * Gets the hex color string (prefixed with #) for the given persona props.
 * This is the logic used internally by the Persona control.
 * @param props - Current persona props
 * @returns Hex color string prefixed with #
 */
export function getPersonaInitialsColor(text: string) {
  var initialsColor;
  var initialsColorCode;

  initialsColor =
    initialsColor !== undefined
      ? initialsColor
      : getInitialsColorFromName(text);
  initialsColorCode = personaInitialsColorToHexCode(initialsColor);

  return initialsColorCode;
}
