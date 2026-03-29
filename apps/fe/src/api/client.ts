import { draftMode } from 'next/headers';
import { stringify } from 'qs-esm';
import { PayloadPage } from './types';

export interface RestClientOptions {
  query?: object;
  method?: string;
  body?: Record<string, unknown>;
  cache?: boolean;
  headers?: Record<string, string>;
  cmsTokenCollection?: string;
  cmsToken?: string;
}

/**
 * Makes a cached REST API call to the Payload CMS
 * @param endpoint - The API endpoint to call (e.g., '/pages')
 * @param options - Optional settings for the request
 * @returns Promise resolving to the JSON response from the API
 */
export const cachingRestClient = async (endpoint: string, options?: RestClientOptions) => {
  return restClient(endpoint, {
    ...options,
    cache: true,
  });
};

/**
 * Makes a REST API call to the Payload CMS
 * @param endpoint - The API endpoint to call (e.g., '/pages')
 * @param options - Optional settings for the request
 * @returns Promise resolving to the JSON response from the API
 */
export const restClient = async (endpoint: string, options?: RestClientOptions) => {
  const {
    query,
    method = 'GET',
    body,
    cache = false,
    headers = {},
    cmsTokenCollection = 'third-party-access',
    cmsToken,
  } = options || {};
  const draft = (await draftMode()).isEnabled;
  const searchParams = stringify({
    ...query,
    draft: draft,
  }, {
    addQueryPrefix: true,
  });

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  if (cmsToken) {
    headers['Authorization'] = `${cmsTokenCollection} API-Key ${cmsToken}`;
  } else if (process.env.HTTP_BASIC_USER && process.env.HTTP_BASIC_PASSWORD) {
    headers['Authorization'] = `Basic ${btoa(`${process.env.HTTP_BASIC_USER}:${process.env.HTTP_BASIC_PASSWORD}`)}`;
  }

  const url = new URL(`${process.env.CMS_URL}/api${endpoint}${searchParams}`);
  try {
    return (await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      next: {
        revalidate: cache ? Number.parseInt(process.env.CACHE_REVALIDATE_TIME ?? '3600') : 0,
      },
    })).json();
  } catch (error) {
    console.error('Error fetching from CMS:', error, url.toString());
    throw error;
  }
};

/**
 * Extracts the first document from a paginated response
 * @template T The type of document to extract
 * @param page - The paginated response from Payload CMS
 * @returns The first document from the response
 * @throws Error if no documents are found in the response
 */
export const getSingleElement = <T>(page: PayloadPage<T>): T => {
  if (page.docs[0]) {
    return page.docs[0];
  } else {
    throw new Error('No documents found in the paginated response!');
  }
};
