import { BadRequestException, PipeTransform } from "@nestjs/common";

export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val.toString() !== value) {
      throw new BadRequestException(`"${value}" не является числом`);
    }
    return val;
  }
}
