class EventBus {
  constructor() {
    this.events = new Map();
    this.onceEvents = new Map();
  }

  on(event, callback, context = null) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    const wrapped = context ? callback.bind(context) : callback;
    this.events.get(event).add(wrapped);
    return () => this.off(event, wrapped);
  }

  once(event, callback, context = null) {
    const wrapped = context ? callback.bind(context) : callback;
    const handler = (...args) => {
      this.off(event, handler);
      wrapped(...args);
    };
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, new Set());
    }
    this.onceEvents.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, callback) {
    this.events.get(event)?.delete(callback);
    this.onceEvents.get(event)?.delete(callback);
  }

  emit(event, ...args) {
    this.events.get(event)?.forEach(cb => {
      try {
        cb(...args);
      } catch (e) {
        console.error(`Error in event handler for "${event}":`, e);
      }
    });
    this.onceEvents.get(event)?.forEach(cb => {
      try {
        cb(...args);
      } catch (e) {
        console.error(`Error in once handler for "${event}":`, e);
      }
    });
    this.onceEvents.get(event)?.clear();
  }

  clear(event) {
    if (event) {
      this.events.delete(event);
      this.onceEvents.delete(event);
    } else {
      this.events.clear();
      this.onceEvents.clear();
    }
  }
}

export const events = new EventBus();
export default events;