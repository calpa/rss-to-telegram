import { ExecutionContext, Hono } from 'hono';
import { checkAndSendUpdates } from './checkAndSendUpdates';

const app = new Hono<{Bindings: CloudflareBindings}>();

/**
 * Health check route
 */
app.get('/', (c) => {
  return c.text('RSS to Telegram push service is running!');
});

/**
 * Route for manually triggering updates
 */
app.get('/check-updates', async (c) => {
  const env = c.env;
  
  try {
    const result = await checkAndSendUpdates(env);
    return c.json({ success: true, sent: result.sent, error: result.error });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

/**
 * Export Cloudflare Worker entry point
 */
export default {
  fetch: app.fetch,
  /**
   * Scheduled task handler function
   * @param {ScheduledEvent} event - Scheduled event
   * @param {CloudflareBindings} env - Environment variables
   * @param {ExecutionContext} ctx - Execution context
   */
  async scheduled(event: ScheduledEvent, env: CloudflareBindings, ctx: ExecutionContext) {
    ctx.waitUntil(checkAndSendUpdates(env));
  },
};
