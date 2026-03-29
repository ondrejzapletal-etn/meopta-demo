'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Container } from '../../components/container/container';
import { Section } from '../../components/section/section';
import { Stack } from '../../components/stack/stack';
import { Typography } from '../../components/typography/typography';

export default function ErrorPage({ error }: Readonly<{ error: Error }>) {
  const t = useTranslations();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section>
      <Container size="large">
        <Stack direction="flex-col" gap="gap-4">
          <Typography variant="h1">{t('errors.500.title')}</Typography>
          <pre>
            <Typography variant="body1">{error.message ?? t('errors.500.description')}</Typography>
          </pre>
        </Stack>
      </Container>
    </Section>
  );
}
