import { redirectsPlugin } from '@payloadcms/plugin-redirects';
import { Page } from '../collections/Page';

/**
 * Redirects plugin configuration for Payload CMS
 * Enables redirect management for specified collections
 * @returns Configured redirects plugin instance
 */
export const redirectsPluginConfig = redirectsPlugin({
  collections: [Page.slug],
});
