import { ZodSchema } from 'zod';

export const configParserFactory =
  <T>(ConfigSchema: ZodSchema<T>) =>
  (config: Record<string, unknown>) =>
    ConfigSchema.parse(config);
