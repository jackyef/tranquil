import { Mixer } from '@/components/Mixer';
import { H1, P, Text, useTheme } from 'flair-kit';
import { css } from 'goober';

export default function HomePage() {
  const { space, colors, fontSizes } = useTheme();

  return (
    <div
      className={css`
        padding: ${space['3xl']} ${space.xl};
        margin: 0 auto;
        max-width: 900px;
        text-align: center;
      `}
    >
      <H1>
        <Text gradient={['primary', 'success']}>Tranquil</Text>
      </H1>

      <P
        className={css`
          font-size: ${fontSizes.h3} !important;
        `}
      >
        Environment sounds to fill the{' '}
        <Text
          className={css`
            font-weight: 700;
            text-shadow: 0px 0px 12px ${colors.foreground[700].color};
          `}
          variant="background"
        >
          void
        </Text>
      </P>

      <Mixer />
    </div>
  );
}
