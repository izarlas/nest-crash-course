import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ItemDto } from "./dto/item.dto";

@Controller("items")
export class ItemsController {
  @Get()
  getAll(): string {
    return "Get all items";
  }

  @Get(":id")
  getOne(@Param("id") id: string): string {
    return `Item ${id}`;
  }

  @Post()
  create(@Body() item: ItemDto): string {
    return `Name: ${item.name}, Description: ${item.description}, Quantity: ${item.quantity}`;
  }

  @Put("id")
  update(@Body() item: ItemDto, @Param("id") id: string): string {
    return `Updated item with id ${id} - Name: ${item.name}, Description: ${item.description}, Quantity: ${item.quantity}`;
  }

  @Delete(":id")
  delete(@Param("id") id: string): string {
    return `Delete item with ${id}`;
  }
}
