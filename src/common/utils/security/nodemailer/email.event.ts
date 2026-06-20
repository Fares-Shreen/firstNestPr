import EventEmitter from "node:events";

export const eventEmitter = new EventEmitter();

export const registerEmailEvent = (eventName: string) => {
    eventEmitter.on(eventName, async (fn) => {
        return fn();
    });
};
