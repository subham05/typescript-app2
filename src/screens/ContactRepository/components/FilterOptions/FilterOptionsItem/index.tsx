import React, {useState} from 'react';
import {Stack, StackItem} from 'components/Stack';
import {Image, TouchableOpacity} from 'react-native';
import {TextView} from 'components';
import {FontSizes} from 'common/theme/font';
import {colors} from 'common/theme/colors';
import {RippleIconButton} from 'components/IconButtons';
import {FilterModal} from 'screens/Contacts';
import {Persona} from 'components/Persona';
import {Styles} from '../../PublicContactRepositoryItem/index.styles';
import {BusinessCard} from 'screens/SharedContactDetails/components/BusinessCard';

interface FilterOptionsItemProps {
  item: FilterModal;
  onSelect?: (value?: FilterModal) => void;
  hideBusinessCard?: boolean;
  textColor?: string;
}
const FilterOptionsItem: React.FC<FilterOptionsItemProps> = ({
  item,
  onSelect,
  hideBusinessCard = false,
  textColor = colors.black,
}) => {
  const [businessCardModal, setBusinessCardModal] = useState<boolean>(false);

  const styles = Styles();

  return (
    <>
      <TouchableOpacity
        onPress={() => onSelect?.(item)}
        style={styles.container}>
        <Stack horizontal horizontalAlign="space-between">
          <StackItem childrenGap={10} horizontal>
            <TouchableOpacity
              onPress={() =>
                !hideBusinessCard &&
                setBusinessCardModal(prevState => !prevState)
              }>
              {item?.contactProfile ? (
                <Image
                  source={{uri: item.contactProfile}}
                  style={styles.photoView}
                />
              ) : (
                item.contactName && <Persona name={item.contactName} />
              )}
            </TouchableOpacity>
            <Stack style={[styles.view]}>
              <Stack
                horizontal
                verticalAlign="center"
                horizontalAlign="space-between">
                <StackItem horizontal childrenGap={5} verticalAlign="center">
                  <TextView
                    weight="medium"
                    variant={FontSizes.medium}
                    style={[styles.contactNameWidth, {color: textColor}]}
                    truncate>
                    {item.contactName}
                  </TextView>
                  {item.hasBusinessCard && businessCardModal && (
                    <RippleIconButton
                      name="attachment"
                      color={colors.primary}
                      onPress={() => {
                        setBusinessCardModal(prevState => !prevState);
                      }}
                    />
                  )}
                </StackItem>
              </Stack>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={[styles.number, {color: textColor}]}>
                {item.role || item.contactPhone}
              </TextView>
            </Stack>
          </StackItem>
        </Stack>
      </TouchableOpacity>
      {businessCardModal && <BusinessCard selectedItem={item} />}
    </>
  );
};
export default FilterOptionsItem;
