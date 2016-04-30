declare module "node-wit" {

  export enum logLevels {
    DEBUG,
    LOG,
    WARN,
    ERROR
  }

  export interface IActions {
    say(sessionId: any, context: any, message: string, callback: Function): void
    merge(sessionId: any, context: any, entities: any, message: string, callback: Function): void
    error(sessionId: any, context: any, err: any): void
  }

  export class Logger {
    constructor(levels: logLevels)
    debug(message: string): void
    log(message: string): void
    warn(message: string): void
    error(message: string): void
  }

  export class Wit {
    constructor(token: string, actions: IActions, logger?: Logger)
    message(message: string, context: any, callback: (err: any, data: any) => void): void
    converse(sessionId: any, message: string, context: any, callback: (err: any, context: any) => void): void
    runActions(sessionId: any, message: string, context: any, callback: (err: any, context: any) => void, maxSteps?: number): void
    interactive(): void
  }
}