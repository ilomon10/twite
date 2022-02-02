import React from 'react';
import { styled } from '../stitches.config';
import { Flex } from '../components/Flex';
import { CheckIcon } from '@radix-ui/react-icons';

const StyledVerifiedBadge = styled('div', Flex, {
  alignItems: 'center',
  backgroundColor: '$blue9',
  borderRadius: '$round',
  color: 'white',
  flexShrink: 0,
  justifyContent: 'center',
  width: '$3',
  height: '$3',
});

export const VerifiedBadge = React.forwardRef((props, forwardedRef) => (
  <StyledVerifiedBadge {...props} ref={forwardedRef}>
    <CheckIcon />
  </StyledVerifiedBadge>
));