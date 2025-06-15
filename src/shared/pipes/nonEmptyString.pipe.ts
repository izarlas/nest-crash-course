import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class NonEmptyStringPipe implements PipeTransform {
  transform(value: string) {
    if (typeof value !== "string" || value.trim().length < 1) {
      throw new BadRequestException(
        "Value must be type of string and cannot be empty"
      );
    }

    return value;
  }
}
