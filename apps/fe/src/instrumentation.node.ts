import { registerOTel } from '@vercel/otel';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';
import { TraceIdRatioBasedSampler, ParentBasedSampler } from '@opentelemetry/sdk-trace-base';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { envDetectorSync, hostDetectorSync, osDetectorSync, processDetectorSync } from '@opentelemetry/resources';
import { metrics } from '@opentelemetry/api';

/**
 * Prometheus metrics exporter configured to listen on the specified port.
 * The port is determined by the METRICS_PORT environment variable.
 */
const exporter = new PrometheusExporter({ port: parseInt(process.env.METRICS_PORT || '') });

/**
 * Register OpenTelemetry with comprehensive monitoring configuration.
 *
 * This setup includes:
 * - Service identification as 'fe'
 * - Prometheus metrics export
 * - Trace sampling configuration
 * - Automatic resource detection (environment, host, process, OS)
 * - HTTP request instrumentation
 * - Node.js runtime metrics instrumentation
 */
registerOTel({
  serviceName: 'fe',
  metricReader: exporter,
  traceSampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(parseFloat(process.env.METRICS_SAMPLING || '')),
  }),
  resourceDetectors: [envDetectorSync, hostDetectorSync, processDetectorSync, osDetectorSync],
  instrumentations: [new HttpInstrumentation(), new RuntimeNodeInstrumentation()],
});

/**
 * Host metrics collector for system-level monitoring.
 * Uses the same MeterProvider as the main OpenTelemetry setup to avoid conflicts.
 * Automatically collects and reports host system metrics such as
 * CPU usage, memory consumption, and disk I/O statistics.
 */
const hostMetrics = new HostMetrics({
  meterProvider: metrics.getMeterProvider(),
});
hostMetrics.start();
