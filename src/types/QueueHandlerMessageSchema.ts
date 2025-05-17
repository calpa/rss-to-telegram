import { z } from "zod";

import { ArticleMetadataSchema } from "./ArticleMetadataSchema";

export const QueueHandlerMessageSchema = z.object({
  ...ArticleMetadataSchema.shape,
  token: z.string(),
});

export type QueueHandlerMessage = z.infer<typeof QueueHandlerMessageSchema>;