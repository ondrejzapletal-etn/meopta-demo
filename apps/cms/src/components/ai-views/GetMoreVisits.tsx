
import { DefaultTemplate } from '@payloadcms/next/templates';
import type { AdminViewServerProps } from 'payload';
import React from 'react';
import Image from 'next/image.js';
import icoChart from '../../img/ico-chart.webp';

export const GetMoreVisitsView: React.FC<AdminViewServerProps> = (props) => {
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
          <Image src={icoChart} alt="" width={24} height={24} style={{ marginRight: 6 }} />
          Získat více návštěv
        </h1>
        <p style={{ marginTop: '16px', color: 'var(--theme-elevation-500)' }}>
          Pomocí AI optimalizujte obsah pro vyhledávače a sociální sítě, abyste přilákali více
          organických návštěvníků na vaše stránky.
        </p>
        <div style={{ color: 'var(--theme-elevation-500)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
                <Image src={require('../../img/ai-agent.webp')} alt="AI agent" width={24} height={24}  />
                SEO specialista</h2>
            <p>Není součástí dema</p>
            <p>Odborník na optimalizaci pro vyhledávače, který vám pomůže zvýšit návštěvnost vašich stránek.</p>
            <button style={{ marginTop: '8px' }}>Validace webu pro vyhledávače</button> &nbsp;
            <button style={{ marginTop: '8px' }}>Chatuj</button> &nbsp;

            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
                <Image src={require('../../img/ai-agent.webp')} alt="AI agent" width={24} height={24}  />
                Specialista na LLM</h2>
            <p>Není součástí dema</p>
            <p>Odborník na optimalizaci odpovědí LLM modelů. Zajistí, aby vaši značku zmiňovaly nástroje jako ChatGPT, Gemini, Copilot...</p>
            <button style={{ marginTop: '8px' }}>Validace webu pro LLM modely</button> &nbsp;
            <button style={{ marginTop: '8px' }}>Chatuj</button> &nbsp;
        </div>
      </div>
    </DefaultTemplate>
  );
};
