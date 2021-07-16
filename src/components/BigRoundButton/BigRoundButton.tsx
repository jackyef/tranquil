import { Button } from 'flair-kit';
import { css } from 'goober';
import { cloneElement } from 'react';

interface Props {
  variant?:
    | 'foreground'
    | 'background'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning';
  icon?: React.ReactElement;
}

export const BigRoundButton = ({
  variant = 'foreground',
  icon,
  ...props
}: Props) => {
  return (
    <Button
      isCTA
      className={css`
        border-radius: 999px !important;
        width: 120px !important;
        height: 120px !important;
        padding: 0 !important;

        &::after {
          border-radius: 999px !important;
        }
      `}
      icon={icon && cloneElement(icon, { width: 80, height: 80 })}
      variant={variant}
      {...props}
    />
  );
};
