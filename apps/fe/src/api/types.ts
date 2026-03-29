/**
 * Represents a paginated response from the Payload CMS API
 * @template T The type of documents in the response
 */
export interface PayloadPage<T> {
  /** Array of documents in the current page */
  docs: T[];
  /** Whether there is a next page available */
  hasNextPage: boolean;
  /** Whether there is a previous page available */
  hasPrevPage: boolean;
  /** Number of documents per page */
  limit: number;
  /** Page number of the next page, null if no next page */
  nextPage: number | null;
  /** Current page number */
  page: number;
  /** Counter for pagination starting from 1 */
  pagingCounter: number;
  /** Page number of the previous page, null if no previous page */
  prevPage: number | null;
  /** Total number of documents across all pages */
  totalDocs: number;
  /** Total number of pages */
  totalPages: number;
}
