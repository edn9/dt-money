export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}