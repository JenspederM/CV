export default class Logger {
  constructor(private name: string) {
    this.name = name;
  }

  info(message: string, method?: string): void {
    this._log("info", message, method);
  }

  error(message: string, method?: string): void {
    this._log("error", message, method);
  }

  warn(message: string, method?: string): void {
    this._log("warn", message, method);
  }

  debug(message: string, method?: string): void {
    this._log("debug", message, method);
  }

  private _log(level: string, message: string, method?: string): void {
    const _message = this.constructMessage(message, method);
    switch (level) {
      case "info":
        console.log(_message);
        break;
      case "error":
        console.error(_message);
        break;
      case "warn":
        console.warn(_message);
        break;
      case "debug":
        console.debug(_message);
        break;
      default:
        console.log(_message);
    }
  }

  private constructMessage(message: string, method?: string): string {
    return method
      ? `[${this.name}] ${method}(): ${message}`
      : `[${this.name}] ${message}`;
  }
}
