export type HealthCheckResult = {
  label: string
  status: 'ok' | 'error' | 'warning'
}
