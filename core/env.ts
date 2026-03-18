import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  RESEND_API_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
});

export const env = () => {
  const vars = {
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };
  
  return envSchema.parse(vars) as Record<string, string | undefined>;
};
