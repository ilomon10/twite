import React from 'react';
import { Text } from './Text';
import { VariantProps, CSS } from '../stitches.config';
import merge from 'lodash.merge';

const DEFAULT_TAG = 'p';

export const Paragraph = React.forwardRef(
  (props, forwardedRef) => {
    // '2' here is the default Paragraph size variant
    const { size = '1', ...textProps } = props;

    // This is the mapping of Paragraph Variants to Text variants
    const textSize = {
      0: { '@initial': '2', '@bp2': '3' },
      1: { '@initial': '3', '@bp2': '4' },
      2: { '@initial': '5', '@bp2': '6' },
    };

    // This is the mapping of Paragraph Variants to Text css
    const textCss = {
      0: { lineHeight: '19px' },
      1: { lineHeight: '25px', '@bp2': { lineHeight: '27px' } },
      2: { color: '$slate11', lineHeight: '27px', '@bp2': { lineHeight: '30px' } },
    };
    return (
      <Text
        as={DEFAULT_TAG}
        {...textProps}
        ref={forwardedRef}
        size={textSize[size]}
        css={{
          ...merge(textCss[size], props.css),
        }}
      />
    );
  }
);

Paragraph.displayName = "Paragraph";