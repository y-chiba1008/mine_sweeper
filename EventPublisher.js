export class EventPublisher {
    constructor() {
        this._listeners = [];
    }

    addEventListener(eventName, callback) {
        if (!callback) {
            return;
        }
        if (typeof (callback) !== 'function') {
            return;
        }

        this._listeners.push({
            eventName: eventName,
            callback: callback,
        });
    }

    fire(eventName, ...args) {
        this._listeners
            .filter((listener) => listener.eventName === eventName)
            .forEach((listener) => {
                listener.callback(...args);
            });
    }
}