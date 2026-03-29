import { Field, FieldHook } from 'payload';

/**
 * Formats a string into a URL-friendly slug.
 *
 * @param val - The input string to format
 * @returns The formatted slug string
 */
const formatSlug = (val: string): string =>
  val
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9-/ ]/g, '') // remove all chars that are not a-z, 0-9, -, / or space
    .replace(/\s+/g, '-'); // replace spaces with -

/**
 * Field hook that automatically generates a slug from the title field.
 *
 * @param value - Current slug value
 * @param data - Form data being submitted
 * @returns The generated or existing slug
 */
const slugHook: FieldHook = async ({ value, data, originalDoc }) => {
  if (value) return formatSlug(value);
  if (data?.title !== undefined) return formatSlug(data.title ?? '');
  // Partial update — neither slug nor title included: preserve the existing slug.
  return originalDoc?.slug as string | undefined;
};

/**
 * Slug field configuration for Payload CMS.
 *
 * Automatically generates URL-friendly slugs from the title field.
 * The field is required, indexed, and unique. And it is accessible only by admin role.
 */
export const Slug: Field = {
  name: 'slug',
  type: 'text',
  admin: {
    description: 'Část URL reprezentující tuto stránku (www.domena.cz/slug). Automaticky se generuje z titulku, ale můžete ji upravit. Používejte pouze písmena, čísla, pomlčky a lomítka. Například: "kontakt", "kontaktni-udaje" nebo "produkty/novinky".',
  },
  //   access: {
  //     update: adminField,
  //     create: adminField,
  //   },
  hooks: {
    beforeChange: [slugHook],
  },
  required: true,
  index: true,
  unique: true,
};
