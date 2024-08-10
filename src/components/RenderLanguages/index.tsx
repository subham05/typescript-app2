import {FontSizes} from 'common/theme/font';
import {StackItem} from 'components/Stack';
import {TextView} from 'components/TextView';
import React, {FC} from 'react';
import {TouchableOpacity} from 'react-native';
import {styles} from './index.styles';
import Arabic from '../../assets/svgs/Arabic.svg';
import English from '../../assets/svgs/English.svg';

interface RenderLangProps {
  languages: string[];
  onLanguageClicked: (val: string) => void;
}

const RenderLanguages: FC<RenderLangProps> = ({
  languages,
  onLanguageClicked,
}) => {
  return (
    <>
      {languages.map((language, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              onLanguageClicked(language);
            }}
            key={index.toString()}
            style={styles.childGap}>
            <StackItem
              horizontal
              style={styles.language}
              childrenGap={16}
              verticalAlign="center">
              {language === 'english' ? (
                <English height={43} width={43} />
              ) : (
                <Arabic height={43} width={43} />
              )}
              <TextView
                weight="medium"
                variant={FontSizes.xMedium}
                style={styles.languageText}>
                {language.charAt(0).toUpperCase() + language.slice(1)}
              </TextView>
            </StackItem>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

export default RenderLanguages;
