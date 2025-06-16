import { HttpException, HttpStatus } from "@nestjs/common";

export class AppException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, errorCode?: string) {
    super(
      {
        statusCode,
        message,
        errorCode: errorCode ?? "UNKNOWN_ERROR",
      },
      statusCode
    );
  }
}
