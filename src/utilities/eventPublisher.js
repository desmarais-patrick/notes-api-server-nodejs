class EventPublisher {
    constructor() {
        this.observers = [];
    }

    addEventObserver(observer) {
        this.observers.push(observer);
        return this;
    }

    publish(type, message, additionalInfo) {
        this.observers.forEach(function (observer) {
            observer.notifyEvent(type, message, additionalInfo);
        });
    }
}

module.exports = EventPublisher;
