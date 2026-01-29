import { prisma } from './prisma'
import { AuditAction } from '@prisma/client'

interface AuditLogParams {
  action: AuditAction
  entityType: string
  entityId: string
  userName?: string
  changes?: Record<string, any>
  metadata?: Record<string, any>
}

export async function createAuditLog({
  action,
  entityType,
  entityId,
  userName = 'system',
  changes,
  metadata,
}: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        userName,
        changes: changes || null,
        metadata: metadata || null,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - audit logging shouldn't break the main operation
  }
}
