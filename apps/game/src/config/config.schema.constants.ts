import { z } from 'zod';

export const config = z.object({
  NODE_ENV: z.string().optional(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().int(),
  GAME_SERVICE_GRPC_URL: z.string(),
  USER_SERVICE_GRPC_URL: z.string(),
  WALLET_SERVICE_GRPC_URL: z.string(),
});

export type ConfigSchema = z.infer<typeof config>;
