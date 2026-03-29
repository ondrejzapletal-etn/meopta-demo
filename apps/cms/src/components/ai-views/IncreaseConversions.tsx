
import { DefaultTemplate } from '@payloadcms/next/templates';
import type { AdminViewServerProps } from 'payload';
import React from 'react';
import Image from 'next/image.js';
import icoUser from '../../img/ico-user.webp';

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
          Zvýšit konverze
        </h1>
        <p style={{ marginTop: '16px', color: 'var(--theme-elevation-500)' }}>
          Nechte AI analyzovat vaše stránky a navrhnout optimalizace, které pomohou zvýšit míru
          konverze a zapojení návštěvníků.
        </p>
        <div style={{ color: 'var(--theme-elevation-500)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '32px' }}>
                <Image src={require('../../img/ai-agent.webp')} alt="AI agent" width={24} height={24}  />
                Specialista na konverze</h2>
            <p>Není součástí dema</p>
            <button style={{ marginTop: '8px' }}>+ Definovat konverzi</button> &nbsp;
            <button style={{ marginTop: '8px' }}>Chatuj</button> &nbsp;
        </div>
      </div>
    </DefaultTemplate>
  );
};
