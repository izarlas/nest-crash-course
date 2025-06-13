import { ApiProperty } from "@nestjs/swagger";
export class ItemDto {
  @ApiProperty({ example: "Some item  name", description: "The item name" })
  readonly name: string;
  @ApiProperty({
    example: "Some item description",
    description: "The item description",
  })
  readonly description: string;
  @ApiProperty({ example: 10, description: "The item quantity" })
  readonly quantity: number;
}
