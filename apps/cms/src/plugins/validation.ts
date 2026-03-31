import { Config, CollectionConfig, Field, Tab } from 'payload';
import { Page } from '../collections/Page';

/**
 * Payload plugin: Adds Validace tab to Page collection, right after SEO tab.
 */
export function validationPlugin(config: Config): Config {
  if (config.collections) {
    config.collections = config.collections.map((col: CollectionConfig) => {
      if (col.slug === Page.slug) {
        const tabsField = col.fields.find((f: Field) => f.type === 'tabs');
        if (tabsField && tabsField.type === 'tabs' && Array.isArray(tabsField.tabs)) {
          const seoTabIndex = tabsField.tabs.findIndex((tab) => 'label' in tab && tab.label === 'SEO');
          const validationTab = {
            label: 'Validace',
            fields: [
              {
                name: 'validationTab',
                type: 'ui',
                admin: {
                  components: {
                    Field: {
                      path: './components/PageAIValidation',
                      exportName: 'PageAIValidationField',
                    },
                  },
                },
              } as Field,
            ],
          } as unknown as Tab;
          if (seoTabIndex !== -1) {
            tabsField.tabs.splice(seoTabIndex + 1, 0, validationTab);
          } else {
            tabsField.tabs.push(validationTab);
          }
        }
      }
      return col;
    });
  }
  return config;
}
