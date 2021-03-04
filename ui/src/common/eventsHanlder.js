import EventEmitter from 'events'

export const emitter = new EventEmitter()

export const subscribeToHttpEvent = (eventName, callback) => emitter.on(eventName, callback)
