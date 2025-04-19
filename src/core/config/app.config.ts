export interface AppConfig {
  /**
   * Indicates whether the application is in production mode.
   * Used to determine the API URL and other environment-specific settings.
   */
  isProduction: boolean
  /**
   * Current version of the application.
   */
  currentVersion: string
  /**
   * Current version of the API.
   */
  apiVersion: string
  /**
   * URL to the CDN where the files uploaded by the users are stored.
   */
  cdnUrl: string
  /**
   * URL to the application itself.
   */
  appUrl: string
  /**
   * URL to the API server.
   */
  apiUrl: string
  /**
   * Maximum file size for uploads in bytes.
   */
  maxFileSizeInBytes: number
  /**
   * Google client ID for OAuth2 authentication.
   * Used for Google Sheets integration.
   */
  googleClientId: string
  /**
   * Timeout for API requests in seconds.
   */
  apiConnectTimeoutSeconds: number
}

const isProduction = import.meta.env.MODE === 'production'

export const appConfig: AppConfig = Object.freeze({
  isProduction,
  currentVersion: '4.0.0',
  apiVersion: '4.0.0',
  cdnUrl: isProduction
    ? 'https://cdn.noo-school.ru/uploads'
    : 'http://localhost:5050',
  appUrl: isProduction ? 'https://noo-school.ru' : 'http://localhost:5173',
  apiUrl: isProduction ? 'https://api.noo-school.ru' : 'http://localhost:3000',
  googleClientId:
    '643513066461-h6vrkoirgj91vr2isaqsm7hrv6tbkml8.apps.googleusercontent.com',
  maxFileSizeInBytes: 150 * 1024 * 1024, // 150 MB
  apiConnectTimeoutSeconds: 30 // 30 seconds
})
