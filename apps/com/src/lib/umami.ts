/**
 * Umami event tracking utility
 * 
 * Provides a type-safe way to track events with Umami analytics.
 * Umami must be loaded via script tag in the layout for this to work.
 */

// Extend the Window interface to include Umami
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string | number | boolean>) => void;
    };
  }
}

/**
 * Track an event with Umami analytics
 * 
 * @param eventName - The name of the event to track
 * @param eventData - Optional data to attach to the event
 * 
 * @example
 * ```ts
 * trackEvent('button_click', { button: 'contact' })
 * ```
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number | boolean>
): void {
  // Only track in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Check if Umami is loaded
  if (window.umami?.track) {
    try {
      window.umami.track(eventName, eventData);
    } catch (error) {
      // Silently fail in production, but log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to track Umami event:', error);
      }
    }
  } else if (process.env.NODE_ENV === 'development') {
    // Warn in development if Umami is not loaded
    console.warn('Umami is not loaded. Event not tracked:', eventName);
  }
}

/**
 * React hook for tracking events (alternative to direct function calls)
 * 
 * @returns Function to track events
 * 
 * @example
 * ```tsx
 * const track = useUmami();
 * track('button_click', { button: 'contact' });
 * ```
 */
export function useUmami() {
  return trackEvent;
}
