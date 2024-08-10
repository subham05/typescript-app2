import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Stack} from 'stack-container';
import React from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  // renderers,
} from 'react-native-popup-menu';

interface MenuProps {
  icon?: string;
  data: MenuModel[];
  height?: number;
  width?: number;
  menuStyle?: StyleProp<ViewStyle>;
  centeredMenu?: boolean;
  marginTop?: number;
  Component?: React.FC;
  optionPadding?: number;
  isDivider?: boolean;
  RenderView?: React.FC;
  onLongPress?: () => void;
  isReceiver?: boolean;
  menuTriggerStyle?: StyleProp<ViewStyle>;
}

export interface MenuModel {
  name: string;
  onClick: () => void;
  icon?: string;
  hide?: boolean;
  titleStyle?: TextStyle;
  rowStyle?: ViewStyle;
}
export const PopupMenu: React.FC<MenuProps> = ({
  icon = 'more',
  data,
  height = 126,
  width = 166,
  menuStyle,
  centeredMenu,
  marginTop = 22,
  Component,
  optionPadding = 10,
  isDivider = false,
  RenderView,
  onLongPress,
  isReceiver = false,
  menuTriggerStyle,
}) => {
  const optionsStyle: StyleProp<ViewStyle | TextStyle> | undefined = {
    height: height,
    width: width,
    justifyContent: 'center',
    marginTop: marginTop,
    alignItems: centeredMenu ? 'center' : undefined,
  };
  // const optionStyle: StyleProp<TextStyle> | undefined = {
  //   // marginLeft: 20,
  // };

  const marginStyle: StyleProp<ViewStyle> | undefined = {
    marginTop: RenderView ? 10 : 0,
  };
  return (
    <Menu>
      <MenuTrigger
        triggerOnLongPress={Component ? true : false}
        onAlternativeAction={onLongPress}
        style={[marginStyle, menuTriggerStyle]}>
        {Component ? (
          <Component />
        ) : RenderView ? (
          <RenderView />
        ) : (
          <Icon name={icon} size={24} color={colors.black} style={menuStyle} />
        )}
      </MenuTrigger>
      <MenuOptions
        optionsContainerStyle={optionsStyle}
        customStyles={{
          optionsContainer: {
            marginLeft: Component
              ? Dimensions.get('screen').width / 1.7
              : RenderView && !isReceiver
              ? Dimensions.get('screen').width / 3.5
              : RenderView && isReceiver
              ? Dimensions.get('screen').width / 6.8
              : undefined,
          },
        }}>
        {data?.map((item, index) => {
          return (
            !item.hide && (
              <Stack key={index.toString()} style={item.rowStyle}>
                <MenuOption onSelect={item.onClick} style={styles().menuOption}>
                  <Stack horizontal childrenGap={item.icon ? 5 : 0} center>
                    {item.icon && (
                      <Icon name={item.icon!} size={20} color={colors.black} />
                    )}
                    <TextView
                      weight="medium"
                      variant={FontSizes.regular}
                      style={[
                        styles(optionPadding).option,
                        item.titleStyle,
                        // item.icon ? undefined : optionStyle,
                      ]}>
                      {item.name}
                    </TextView>
                  </Stack>
                </MenuOption>
                {index !== data.length - 1 && !isDivider && (
                  <Stack spacing={8}>
                    <Divider size={2} />
                  </Stack>
                )}
              </Stack>
            )
          );
        })}
      </MenuOptions>
    </Menu>
  );
};

const styles = (optionPadding?: number) =>
  StyleSheet.create({
    option: {
      color: colors.black,
      paddingVertical: optionPadding,
      // marginLeft: 20,
    },
    menuOption: {alignItems: 'flex-start', paddingLeft: 16},
  });
