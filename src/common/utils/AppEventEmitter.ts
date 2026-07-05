import type { Listener } from './types';

class AppEventEmitter {
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  public on(event: string, listener: (...args: any[]) => void): void {
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener);
    this.listeners.set(event, set);
  }

  public off(event: string, listener: (...args: any[]) => void): void {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(listener);
    if (set.size === 0) this.listeners.delete(event);
  }

  public emit(event: string, ...args: any[]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    // copy to avoid mutation during iteration
    Array.from(set).forEach((listener) => {
      try {
        listener(...args);
      } catch (err) {
        // swallow to avoid breaking other listeners
        // but log for debugging
        // eslint-disable-next-line no-console
        console.error('AppEventEmitter listener error:', err);
      }
    });
  }

  public removeAll(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

export const appEventEmitter = new AppEventEmitter();