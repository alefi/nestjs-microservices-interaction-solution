import { z } from 'zod';

export const config = z.object({
  NODE_ENV: z.string().optional(),
  WEB_GATEWAY_SERVICE_HTTP_PORT: z.coerce.number().int(),
  GAME_SERVICE_GRPC_URL: z.string(),
  WALLET_SERVICE_GRPC_URL: z.string(),
});

export type ConfigSchema = z.infer<typeof config>;
