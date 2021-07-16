import { H1, P, Text, useTheme } from 'flair-kit';
import { css } from 'goober';

export default function HomePage() {
  const { space } = useTheme();

  return (
    <div
      className={css`
        padding: 25vh ${space.xl};
        margin: 0 auto;
        max-width: 900px;
        text-align: center;
      `}
    >
      <H1>
        <Text gradient={['dark']}>Next</Text> +{' '}
        <Text gradient={['primary', 'secondary']}>Flair</Text>
      </H1>

      <P>Hello world! This is a sample Next.js app with Flair setup.</P>
    </div>
  );
}
