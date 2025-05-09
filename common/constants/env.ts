import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_ADS_TEST: z.coerce.number(),
  EXPO_PUBLIC_HIDE_ADS: z.coerce.number(),
});

export const ENV = envSchema.parse(process.env);
