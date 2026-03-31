import { DefaultTemplate } from '@payloadcms/next/templates';
import type { AdminViewServerProps } from 'payload';
import React from 'react';
import Image from 'next/image.js';
import icoUser from '../../img/ico-user.webp';
import aiAgentImg from '../../img/ai-agent.webp';

export const IncreaseConversionsView: React.FC<AdminViewServerProps> = (props) => {
  const { initPageResult, params, searchParams } = props;
  const { permissions, req, visibleEntities } = initPageResult;
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={{
        collections: visibleEntities?.collections,
        globals: visibleEntities?.globals,
      }}
    >
      <div style={{ padding: '40px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src={icoUser} alt="" width={24} height={24} style={{ marginRight: 6 }} />
          Validace webu
        </h1>
        <p style={{ marginTop: '16px', color: 'var(--theme-elevation-500)' }}>
          Nechte AI analyzovat vaše stránky a navrhnout optimalizace, které pomohou zlepšit SEO a zapojení návštěvníků.
        </p>
        <div style={{ color: 'var(--theme-elevation-500)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
            <Image src={aiAgentImg} alt="AI agent" width={24} height={24} />
            Validace SEO
          </h2>
          <p>Není součástí dema</p>
          <button style={{ marginTop: '8px' }}>Validovat web pro SEO</button>
          {' '}
          {' '}
&nbsp;

          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
            <Image src={aiAgentImg} alt="AI agent" width={24} height={24} />
            Validace GEO
          </h2>
          <p>Není součástí dema</p>
          <button style={{ marginTop: '8px' }}>Validovat web pro GEO</button>
          {' '}
          {' '}
&nbsp;
        </div>
      </div>
    </DefaultTemplate>
  );
};
