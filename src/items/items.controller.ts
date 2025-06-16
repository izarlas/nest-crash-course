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
import { ItemsService } from "./items.service";
import { ItemInterface } from "./interfaces/item.interface";
import { NonEmptyStringPipe } from "../shared/pipes/nonEmptyString.pipe";

@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  getAll(): Promise<ItemInterface[]> {
    return this.itemsService.getAll();
  }

  @Get(":id")
  async getOne(
    @Param("id", NonEmptyStringPipe) id: string
  ): Promise<ItemInterface | null> {
    return await this.itemsService.getOne(id);
  }

  @Post()
  create(@Body() item: ItemDto): Promise<ItemInterface> {
    return this.itemsService.create(item);
  }

  @Put(":id")
  update(
    @Body() item: ItemDto,
    @Param("id", NonEmptyStringPipe) id: string
  ): Promise<ItemInterface | null> {
    return this.itemsService.update(id, item);
  }

  @Delete(":id")
  delete(
    @Param("id", NonEmptyStringPipe) id: string
  ): Promise<ItemInterface | null> {
    return this.itemsService.delete(id);
  }
}
