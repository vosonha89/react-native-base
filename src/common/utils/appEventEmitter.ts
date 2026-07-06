import { AnyType } from 'one-frontend-framework';

/**
 * Global application event emitter.
 *
 * Provides a lightweight pub/sub mechanism for decoupled communication
 * between modules. Use the singleton `appEventEmitter` export rather than
 * instantiating this class directly.
 *
 * @example
 * import { appEventEmitter } from './appEventEmitter';
 *
 * // Subscribe
 * appEventEmitter.on('user:login', (userId) => { ... });
 *
 * // Emit
 * appEventEmitter.emit('user:login', 'usr_abc123');
 *
 * // Unsubscribe
 * appEventEmitter.off('user:login', handler);
 */
class AppEventEmitter {
  /** @internal Map of event names to sets of registered listener functions. */
  private readonly listeners: Map<string, Set<(...args: AnyType[]) => void>> =
    new Map();

  /**
   * Register a listener for the given event.
   *
   * @param event   - The event name to subscribe to.
   * @param listener - Callback invoked every time the event is emitted.
   *
   * @remarks
   * Adding the same listener twice is idempotent — it will only fire once per emission.
   */
  public on(event: string, listener: (...args: AnyType[]) => void): void {
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener);
    this.listeners.set(event, set);
  }

  /**
   * Remove a previously registered listener.
   *
   * @param event   - The event name the listener was registered for.
   * @param listener - The exact function reference to remove.
   *
   * @remarks
   * If no listeners remain for the event, the event entry is cleaned up internally.
   * Calling `off` for a non-existent listener or event is a no-op.
   */
  public off(event: string, listener: (...args: AnyType[]) => void): void {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(listener);
    if (set.size === 0) this.listeners.delete(event);
  }

  /**
   * Emit an event, invoking all registered listeners with the supplied arguments.
   *
   * @param event - The event name to emit.
   * @param args  - Arguments forwarded to every listener.
   *
   * @remarks
   * - Listeners are called synchronously in registration order.
   * - A snapshot of the listener set is taken before iteration, so adding or
   *   removing listeners during emission does **not** affect the current cycle.
   * - If a listener throws, the error is caught and logged; other listeners
   *   are not affected.
   */
  public emit(event: string, ...args: AnyType[]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    // Copy to avoid mutation during iteration
    Array.from(set).forEach(listener => {
      try {
        listener(...args);
      } catch (err) {
        // Swallow to avoid breaking other listeners, but log for debugging
        console.error('AppEventEmitter listener error:', err);
      }
    });
  }

  /**
   * Remove all listeners, optionally scoped to a single event.
   *
   * @param event - (Optional) If provided, only listeners for this event
   *                are removed. Otherwise **all** listeners are cleared.
   *
   * @example
   * // Remove every listener for 'user:login'
   * emitter.removeAll('user:login');
   *
   * // Wipe every listener across all events
   * emitter.removeAll();
   */
  public removeAll(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

export const appEventEmitter = new AppEventEmitter();
