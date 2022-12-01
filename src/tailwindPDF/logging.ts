class Logger {
  private name: string;
  private _method: string;

  // Aliases
  m = this.method;

  constructor(name: string) {
    this.name = name;
    this._method = "";
  }

  getChildLogger(name: string): Logger {
    return new Logger(`${this.name}.${name}`);
  }

  method(name: string): Logger {
    this._method = name;
    return this;
  }

  info(message: string, method?: string, ...args: any[]) {
    return this._log("info", message, method, args);
  }

  error(message: string, method?: string, ...args: any[]) {
    return this._log("error", message, method, args);
  }

  warn(message: string, method?: string, ...args: any[]) {
    return this._log("warn", message, method, args);
  }

  debug(message: string, ...args: any[]) {
    return this._log("debug", message, args);
  }

  private _log(level: string, message: string, ...args: any[]) {
    const _message = this.constructMessage(message);
    let logger;
    switch (level) {
      case "info":
        logger = console.info;
        break;
      case "error":
        logger = console.error;
        break;
      case "warn":
        logger = console.warn;
        break;
      case "debug":
        logger = console.debug;
        break;
      default:
        logger = console.log;
    }

    if (args[0]?.length > 0) {
      logger(_message, ...args[0]);
    } else {
      logger(_message);
    }

    this._method = "";

    return this;
  }

  private constructMessage(message: string, method?: string): string {
    const logCaller =
      this._method !== "" ? `${this.name}.${this._method}()` : this.name;
    return method
      ? `${new Date().toISOString()}: [${logCaller}] ${method}(): ${message}`
      : `${new Date().toISOString()}: [${logCaller}] ${message}`;
  }
}

const ROOT_LOGGER = new Logger("TailwindPDF");

export const getLogger = (name: string): Logger => {
  return ROOT_LOGGER.getChildLogger(name);
};

export default ROOT_LOGGER;
