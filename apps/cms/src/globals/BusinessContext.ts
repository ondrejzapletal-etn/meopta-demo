import { GlobalConfig } from 'payload';

/**
 * BusinessContext global — stores company-specific information that is injected
 * into AI prompts so agents produce brand-consistent outputs.
 *
 * Loaded as a relevant subset by the /api/ai/chat endpoint on every request.
 */
export const BusinessContext: GlobalConfig = {
  slug: 'business-context',
  label: {
    en: 'Your business context for AI',
    cs: 'Váš business context pro AI',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: false,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: { en: 'Company Name', cs: 'Název společnosti' },
    },
    {
      name: 'businessDescription',
      type: 'textarea',
      label: { en: 'Business Description', cs: 'Popis businessu' },
    },
    {
      name: 'targetAudience',
      type: 'textarea',
      label: { en: 'Target Audience', cs: 'Cílová skupina' },
    },
    {
      name: 'communicationStyle',
      type: 'textarea',
      label: { en: 'Communication Style', cs: 'Styl komunikace' },
    },
    {
      name: 'services',
      type: 'textarea',
      label: { en: 'Products & Services', cs: 'Produkty a služby' },
    },
    {
      name: 'seoPriorities',
      type: 'textarea',
      label: { en: 'SEO Priorities', cs: 'SEO priority' },
    },
    {
      name: 'brandVoice',
      type: 'textarea',
      label: { en: 'Brand Voice', cs: 'Brand voice' },
    },
    {
      name: 'forbiddenPhrases',
      type: 'textarea',
      label: { en: 'Forbidden Phrases', cs: 'Zakázané fráze' },
    },
    {
      name: 'editorialRules',
      type: 'textarea',
      label: { en: 'Editorial Rules', cs: 'Editoriální pravidla' },
    },
    {
      name: 'importantEntities',
      type: 'textarea',
      label: { en: 'Important Entities', cs: 'Důležité entity' },
    },
    {
      name: 'competitors',
      type: 'textarea',
      label: { en: 'Competitors', cs: 'Konkurenti' },
    },
  ],
};
