import { z } from 'zod';

export const config = z.object({
  NODE_ENV: z.string().optional(),
  GAME_SERVICE_GRPC_URL: z.string(),
  WALLET_SERVICE_GRPC_URL: z.string(),
});

export type ConfigSchema = z.infer<typeof config>;
