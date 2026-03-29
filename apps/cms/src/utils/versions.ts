import { CollectionConfig } from 'payload';

/**
 * Configuration for Payload CMS collection versions including drafts and scheduling
 */
export const versionsConfig: CollectionConfig['versions'] = {
  drafts: {
    autosave: {
      interval: 400,
    },
    schedulePublish: {
      timeFormat: 'HH:mm',
    },
  },
};
