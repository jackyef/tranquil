import { FireIcon, PlayIcon } from '@heroicons/react/solid';
import { BigRoundButton } from '@/components/BigRoundButton';
import { Beach, Lightning, Mountain, Rain, Wind } from 'iconic-react';
import { Button, useTheme } from 'flair-kit';
import { css } from 'goober';

export const Mixer = () => {
  const { space } = useTheme();

  return (
    <div>
      <div
        className={css`
          margin: ${space['3xl']} 0;
        `}
      >
        <BigRoundButton icon={<PlayIcon />} variant="foreground" />
      </div>

      <div
        className={css`
          display: flex;
          gap: ${space['2xl']};
          margin: ${space['3xl']} 0;
          justify-content: center;
          flex-wrap: wrap;
        `}
      >
        <Button
          isCTA
          icon={<Lightning width={40} height={40} />}
          variant="warning"
        />
        <Button
          isCTA
          icon={<FireIcon width={40} height={40} />}
          variant="error"
        />
        <Button isCTA icon={<Rain width={40} height={40} />} variant="dark" />
        <Button isCTA icon={<Wind width={40} height={40} />} variant="light" />
        <Button
          isCTA
          icon={<Beach width={40} height={40} />}
          variant="primary"
        />
        <Button
          isCTA
          icon={<Mountain width={40} height={40} />}
          variant="success"
        />
      </div>
    </div>
  );
};
