/**
 * @see https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
 */
export enum PrismaErrorCode {
  ForeignKeyConstraintFailed = 'P2003',
  RelatedRecordNotFound = 'P2025',
  UniqueConstraintFailed = 'P2002',
}
