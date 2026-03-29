import { useTranslations } from 'next-intl';
import { Container } from '../../components/container/container';
import { Section } from '../../components/section/section';
import { Stack } from '../../components/stack/stack';
import { Typography } from '../../components/typography/typography';

export default function NotFound() {
  const t = useTranslations();

  return (
    <Section>
      <Container size="large">
        <Stack direction="flex-col" gap="gap-4">
          <Typography variant="h1">{t('errors.404.title')}</Typography>
          <Typography variant="body1">{t('errors.404.description')}</Typography>
        </Stack>
      </Container>
    </Section>
  );
};
