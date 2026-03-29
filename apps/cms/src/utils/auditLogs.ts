import path from 'node:path';
import {
  PayloadRequest,
} from 'payload';
import pino from 'pino';

const auditLogger = createAuditLogger();

/**
 * Creates an audit log entry specifically for authentication operations.
 * This function logs authentication events to the file system (if configured).
 *
 * @param req - The PayloadRequest object containing request context and user information
 * @param operation - The authentication operation being performed (e.g., "login", "logout", "register")
 * @param data - Additional data associated with the authentication operation
 * @returns Promise that resolves when the audit log has been created
 */
export async function createAuditAuthLog(
  req: PayloadRequest,
  operation: string,
  data: unknown,
) {
  const auditLog = {
    request: getRequestData(req),
    operation: `auth:${operation}`,
    data,
  };

  auditLogger.info(auditLog);
};

/**
 * Creates a general audit log entry for document operations within collections.
 * This function records changes made to documents in any Payload collection,
 * logging both to the file system (if configured) and the database.
 *
 * @param req - The PayloadRequest object containing request context and user information
 * @param documentId - The ID of the document being modified, or null if not applicable
 * @param changes - Object containing the changes made to the document
 * @param operation - The type of operation performed (e.g., "create", "update", "delete")
 * @param collectionName - The name of the collection where the operation occurred, or null if not applicable
 * @returns Promise that resolves when the audit log has been created
 */
export async function createAuditLog(
  req: PayloadRequest,
  documentId: string | null,
  changes: Record<string, unknown>,
  operation: string,
  collectionName: string | null,
) {
  const auditLog = {
    request: getRequestData(req),
    documentId: documentId?.toString(),
    changes,
    operation,
    collectionName,
  };

  auditLogger.info(auditLog);
};

/**
 * Anonymizes sensitive data from a change payload before logging.
 * This function removes sensitive fields such as password hashes, API keys,
 * and authentication tokens to ensure they are not stored in audit logs.
 *
 * @param data - The original data object that may contain sensitive information
 * @returns A new object with sensitive fields removed, safe for audit logging
 */
export function anonymizeChangePayload(data: Record<string, unknown>): Record<string, unknown> {
  // Sanitize User collection
  delete data.salt;
  delete data.hash;
  delete data.resetPasswordExpiration;
  delete data.resetPasswordToken;
  delete data.verificationToken;

  // Sanitize collections with useAPIKey=true
  delete data.apiKey;
  delete data.apiKeyIndex;

  return { ...data };
}

function createAuditLogger(): pino.Logger {
  // TODO: How to log in a containerized environment?

  if (!process.env.AUDIT_LOG_FILE) {
    // If no log file is specified, disable logging to file
    return pino({
      enabled: false,
    });
  }

  const logFilePath = path.resolve(process.cwd(), process.env.AUDIT_LOG_FILE);
  return pino(pino.destination(logFilePath));
}

function getRequestData(req: PayloadRequest): Record<string, unknown> {
  return {
    origin: req?.origin,
    ip: req?.headers.get('x-forwarded-for'),
    href: req?.href,
    user: req?.user?.id,
  };
}
