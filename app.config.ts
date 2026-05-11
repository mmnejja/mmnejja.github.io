import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

/**
 * appConfig
 *
 * Angular standalone application configuration.
 *
 * Key decisions:
 * - withFetch(): uses the Fetch API instead of XHR (better performance)
 * - provideZoneChangeDetection({ eventCoalescing: true }): reduces
 *   unnecessary CD cycles by coalescing browser events
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
};
