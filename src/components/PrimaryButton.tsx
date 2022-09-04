import React, { LegacyRef, forwardRef } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

function PrimaryButton(
  { children, ...props }: ButtonProps,
  ref: LegacyRef<HTMLButtonElement>,
) {
  return (
    <Button
      bg="blue.400"
      color="white"
      _hover={{
        bg: 'blue.500',
      }}
      {...props}
      ref={ref}
    >
      {children}
    </Button>
  );
}

export default forwardRef(PrimaryButton);
