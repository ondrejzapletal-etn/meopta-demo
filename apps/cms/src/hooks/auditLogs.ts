import {
  AfterErrorHook,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterForgotPasswordHook,
  CollectionAfterLoginHook,
  CollectionAfterLogoutHook,
  GlobalAfterChangeHook,
} from 'payload';
import { anonymizeChangePayload, createAuditAuthLog, createAuditLog } from '../utils/auditLogs';

/**
 * Creates an audit log entry when a global document is modified.
 *
 * @param params - The hook parameters
 * @param params.doc - The updated global document
 * @param params.previousDoc - The previous version of the global document
 * @param params.req - The request object containing user and context information
 * @param params.global - The global configuration object
 * @returns A promise that resolves when the audit log is created
 */
export const createAuditLogGlobalsModify: GlobalAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  global,
}) => {
  const payload = {
    before: anonymizeChangePayload(previousDoc),
    after: anonymizeChangePayload(doc),
  };
  await createAuditLog(req, doc.id, payload, 'update', global.slug);
};

/**
 * Creates an audit log entry when a collection document is modified (create or update).
 *
 * @param params - The hook parameters
 * @param params.doc - The modified collection document
 * @param params.previousDoc - The previous version of the document (undefined for create operations)
 * @param params.operation - The type of operation ('create' or 'update')
 * @param params.req - The request object containing user and context information
 * @param params.collection - The collection configuration object
 * @returns A promise that resolves when the audit log is created
 */
export const createAuditLogModify: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
  collection,
}) => {
  const payload = {
    before: anonymizeChangePayload(previousDoc),
    after: anonymizeChangePayload(doc),
  };
  await createAuditLog(req, doc.id, payload, operation, collection.slug);
};

/**
 * Creates an audit log entry when a collection document is deleted.
 *
 * @param params - The hook parameters
 * @param params.req - The request object containing user and context information
 * @param params.id - The ID of the deleted document
 * @param params.doc - The document that was deleted
 * @param params.collection - The collection configuration object
 * @returns A promise that resolves when the audit log is created
 */
export const createAuditLogDelete: CollectionAfterDeleteHook = async ({ req, id, doc, collection }) => {
  const payload = {
    before: anonymizeChangePayload(doc),
    after: {},
  };
  await createAuditLog(req, id.toString(), payload, 'delete', collection.slug);
};

/**
 * Creates an audit log entry when a user successfully logs in.
 *
 * @param params - The hook parameters
 * @param params.req - The request object containing user and context information
 * @param params.user - The user object of the authenticated user
 * @returns A promise that resolves when the audit log is created
 */
export const createAuditLogLogin: CollectionAfterLoginHook = async ({ req, user }) => {
  await createAuditAuthLog(req, 'login', {
    user: user.id,
  });
};

/**
 * Creates an audit log entry when a user logs out.
 *
 * @param params - The hook parameters
 * @param params.req - The request object containing user and context information
 * @returns A promise that resolves when the audit log is created
 */
export const createAuditLogLogout: CollectionAfterLogoutHook = async ({ req }) => {
  await createAuditAuthLog(req, 'logout', {
    user: req.user?.id,
  });
};

/**
 * Creates an audit log entry when a user requests a password reset.
 *
 * @param params - The hook parameters
 * @param params.args - The arguments containing request and form data
 * @returns A promise that resolves when the audit log is created
 */
export const createAuditLogForgotPassword: CollectionAfterForgotPasswordHook = async ({ args }) => {
  await createAuditAuthLog(args?.req, 'forgotPassword', {
    email: args?.data?.email,
  });
};

/**
 * Creates an audit log entry when a login attempt fails with an error.
 *
 * @param params - The hook parameters
 * @param params.req - The request object containing user and context information
 * @param params.error - The error object that occurred during login
 * @returns A promise that resolves when the audit log is created
 */
export const createAuditLogLoginError: AfterErrorHook = async ({ req, error }) => {
  await createAuditAuthLog(req, 'error', {
    email: req.data?.email,
    error: error.message,
  });
};
