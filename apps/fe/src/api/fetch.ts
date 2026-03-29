import { Branch, Page, Redirect, Search } from '@repo/shared/payload-types';
import { cachingRestClient, restClient, getSingleElement } from './client';
import { PayloadPage } from './types';

export const fetchPage = async (slug: string): Promise<Page> => {
  const query = {
    where: {
      slug: { equals: slug },
    },
    depth: 2,
  };
  const response = await cachingRestClient('/pages', {
    query,
  }) as PayloadPage<Page>;
  return getSingleElement(response);
};

export const fetchSearch = async (search: string): Promise<PayloadPage<Search>> => {
  const query = {
    where: {
      or: [
        {
          title: {
            like: search,
          },
        },
        {
          description: {
            like: search,
          },
        },
      ],
    },
  };
  return await cachingRestClient('/search', {
    query,
  }) as PayloadPage<Search>;
};

export const fetchBranch = async (slug: string): Promise<Branch | null> => {
  const query = {
    where: {
      slug: { equals: slug },
    },
    depth: 2,
  };
  const response = (await cachingRestClient('/branches', {
    query,
  })) as PayloadPage<Branch>;
  return response.docs[0] ?? null;
};

export const fetchHeader = async () => {
  return restClient('/globals/header');
};

export const fetchFooter = async () => {
  return restClient('/globals/footer');
};

export const fetchSettings = async () => {
  return restClient('/globals/settings');
};

export const fetchRedirects = async (): Promise<Redirect[]> => {
  const response = await restClient('/redirects', {
    query: { limit: 0, pagination: false, depth: 1 },
  }) as PayloadPage<Redirect>;
  return response.docs ?? [];
};
