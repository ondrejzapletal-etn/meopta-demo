import { DefaultTemplate } from '@payloadcms/next/templates';
import type { AdminViewServerProps } from 'payload';
import React from 'react';
import Image from 'next/image.js';
import icoChart from '../../img/ico-chart.webp';
import aiAgentImg from '../../img/ai-agent.webp';

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
          ZÃ­skat vÃ­ce nÃ¡vÅ¡tÄ›v
        </h1>
        <p style={{ marginTop: '16px', color: 'var(--theme-elevation-500)' }}>
          PomocÃ­ AI optimalizujte obsah pro vyhledÃ¡vaÄe a sociÃ¡lnÃ­ sÃ­tÄ›, abyste pÅ™ilÃ¡kali vÃ­ce
          organickÃ½ch nÃ¡vÅ¡tÄ›vnÃ­kÅ¯ na vaÅ¡e strÃ¡nky.
        </p>
        <div style={{ color: 'var(--theme-elevation-500)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
            <Image src={aiAgentImg} alt="AI agent" width={24} height={24} />
            SEO specialista
          </h2>
          <p>NenÃ­ souÄÃ¡stÃ­ dema</p>
          <p>OdbornÃ­k na optimalizaci pro vyhledÃ¡vaÄe, kterÃ½ vÃ¡m pomÅ¯Å¾e zvÃ½Å¡it nÃ¡vÅ¡tÄ›vnost vaÅ¡ich strÃ¡nek.</p>
          <button style={{ marginTop: '8px' }}>Validace webu pro vyhledÃ¡vaÄe</button>
          {' '}
&nbsp;
          <button style={{ marginTop: '8px' }}>Chatuj</button>
          {' '}
&nbsp;

          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
            <Image src={aiAgentImg} alt="AI agent" width={24} height={24} />
            Specialista na LLM
          </h2>
          <p>NenÃ­ souÄÃ¡stÃ­ dema</p>
          <p>OdbornÃ­k na optimalizaci odpovÄ›dÃ­ LLM modelÅ¯. ZajistÃ­, aby vaÅ¡i znaÄku zmiÅˆovaly nÃ¡stroje jako ChatGPT, Gemini, Copilot...</p>
          <button style={{ marginTop: '8px' }}>Validace webu pro LLM modely</button>
          {' '}
&nbsp;
          <button style={{ marginTop: '8px' }}>Chatuj</button>
          {' '}
&nbsp;
        </div>
      </div>
    </DefaultTemplate>
  );
};
