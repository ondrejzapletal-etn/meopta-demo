import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
import { registerOTel } from '@vercel/otel';

/**
 * Registers OpenTelemetry instrumentation for the CMS application.
 *
 * This function sets up different instrumentation based on the runtime environment:
 * - **Node.js runtime**: Imports and executes Node.js-specific instrumentation from `./instrumentation.node`
 * - **Edge runtime**: Configures Vercel's OpenTelemetry integration with:
 *   - Service name identification as 'fe'
 *   - Parent-based trace sampling strategy
 *   - Configurable sampling rate via `METRICS_SAMPLING` environment variable
 *
 * The sampling strategy respects parent span decisions while applying ratio-based sampling
 * for root spans, enabling efficient trace collection with configurable overhead.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME == 'nodejs') {
    await import('./instrumentation.node');
  } else {
    registerOTel({
      serviceName: 'fe',
      traceSampler: new ParentBasedSampler({
        root: new TraceIdRatioBasedSampler(parseFloat(process.env.METRICS_SAMPLING || '')),
      }),
    });
  }
}
