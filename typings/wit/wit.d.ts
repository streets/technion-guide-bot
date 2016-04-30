declare module "node-wit" {

  export enum logLevels {
    DEBUG,
    LOG,
    WARN,
    ERROR
  }

  export interface Actions {
    say(sessionId: string, context: any, message: string, callback: Function): void
    merge(sessionId: string, context: any, entities: any, message: string, callback: Function): void
    error(sessionId: string, context: any, err: any): void
  }

  export class Logger {
    constructor(levels: logLevels)
    debug(message: string): void
    log(message: string): void
    warn(message: string): void
    error(message: string): void
  }

  export class Wit {
    constructor(token: string, actions: Actions, logger?: Logger)
    message(message: string, context: any, callback: (err: any, data: any) => void): void
    converse(sessionId: string, message: string, context: any, callback: (err: any, context: any) => void): void
    runActions(sessionId: string, message: string, context: any, callback: (err: any, context: any) => void, maxSteps?: number): void
    interactive(): void
  }
}