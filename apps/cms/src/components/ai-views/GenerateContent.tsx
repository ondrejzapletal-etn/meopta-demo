import { DefaultTemplate } from '@payloadcms/next/templates';
import type { AdminViewServerProps } from 'payload';
import React from 'react';
import Image from 'next/image.js';
import icoGenerate from '../../img/ico-generate.webp';
import icoChart from '../../img/ico-chart.webp';
import icoUser from '../../img/ico-user.webp';
import aiAgentImg from '../../img/ai-agent.webp';

export const GenerateContentView: React.FC<AdminViewServerProps> = (props) => {
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
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image src={icoGenerate} alt="" width={24} height={24} style={{ marginRight: 6 }} />
          Přehled AI funkcí
        </h1>
        <p style={{ marginTop: '16px', color: 'var(--theme-elevation-500)' }}>
          Využijte AI pomocníky k automatickému generování obsahu pro váš web, jeho optimalizaci pro vaše potenciální klienty, vyhledávače, LLM modely a zajištění konzistence s vaším business contextem.
        </p>
        <a href="/admin/globals/business-context" style={{ textDecoration: 'none' }}>
          <button style={{ marginTop: '8px' }}>Spravovat kontext</button>
        </a>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
          <Image src={aiAgentImg} alt="AI agent" width={24} height={24} />
          SEO specialista
        </h2>
        <p>Odborník na optimalizaci pro vyhledávače, který vám vytvoří optimalizované texty pro každou stránku.</p>
        <div style={{ marginLeft: '32px' }}>
          <h3 style={{ marginTop: '16px' }}>Validace konkrétních stránek</h3>
          <p>Najděte konkrétní stránku nebo článek, který chcete upravit, a zadejte klíčová slova nebo témata, která chcete zahrnout.</p>
          <h3 style={{ marginTop: '16px' }}>Validace celého webu</h3>
          <p>Přejděte na záložku SEO a vygenerujte z obsahu článku meta popis a vhodný titulek stránky.</p>
          <button style={{ marginTop: '8px' }}>Validace webu pro SEO</button>
          {' '}
          {' '}
&nbsp;
        </div>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
          <Image src={aiAgentImg} alt="AI agent" width={24} height={24} />
          Specialista na LLM
        </h2>
        <p>Odborník na optimalizaci odpovědí LLM modelů. Zajistí, aby vaši značku zmiňovaly nástroje jako ChatGPT, Gemini, Copilot...</p>
        <div style={{ marginLeft: '32px' }}>
          <h3 style={{ marginTop: '16px' }}>Validace konkrétních stránek</h3>
          <p>Najděte konkrétní stránku nebo článek, který chcete upravit, a zadejte klíčová slova nebo témata, která chcete zahrnout.</p>
          <h3 style={{ marginTop: '16px' }}>Validace celého webu</h3>
          <p>Přejděte na záložku SEO a vygenerujte z obsahu článku meta popis a vhodný titulek stránky.</p>
          <button style={{ marginTop: '8px' }}>Validace webu pro LLM modely</button>
          {' '}
          {' '}
&nbsp;
        </div>

        <div style={{ color: 'var(--theme-elevation-500)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
            <Image src={aiAgentImg} alt="AI agent" width={24} height={24} />
            Content manažer
          </h2>
          <p>Není součástí dema</p>
          <p>Specialista na tvorbu vašeho obsahu. Pracuje s pravidly specifickými pro váš web a váš business.</p>
          <button style={{ marginTop: '8px' }}>+ Nová stránka</button>
          {' '}
          {' '}
&nbsp;
          <button style={{ marginTop: '8px' }}>+ Nová pozice v kariéře</button>
          {' '}
          {' '}
&nbsp;
          <button style={{ marginTop: '8px' }}>+ Nová komponenta</button>

          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
            <Image src={aiAgentImg} alt="AI agent" width={24} height={24} />
            Grafik
          </h2>
          <p>Není součástí dema</p>
          <p>Umělec, který přesně rozumí vaší značce a bude pro vás vytvářet obrázky na míru.</p>
          <button style={{ marginTop: '8px' }}>+ Nový ilustrační obrázek</button>
          {' '}
          {' '}
&nbsp;
        </div>
      </div>

    </DefaultTemplate>
  );
};
