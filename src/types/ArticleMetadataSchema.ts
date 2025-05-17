import { z } from "zod";

export const ArticleMetadataSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  description: z.string(),
  timestamp: z.string().datetime(),
  thumbnailURL: z.string().url(),
});

export type ArticleMetadata = z.infer<typeof ArticleMetadataSchema>;