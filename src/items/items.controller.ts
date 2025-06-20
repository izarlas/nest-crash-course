import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
} from "@nestjs/common";
import { ItemsService } from "./items.service";
import { ItemInterface } from "./interfaces/item.interface";
import { NonEmptyStringPipe } from "../shared/pipes/nonEmptyString.pipe";
import { MongodbIdValidationPipe } from "../shared/pipes/mongodbValidationId.pipe";
import { ZodValidationPipe } from "../shared/pipes/zodValidation.pipe";
import {
  ItemValidationDto,
  itemValidationSchema,
  PartialItemValidationDto,
  partialItemValidationSchema,
} from "./item.validation";

@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  getAll(): Promise<ItemInterface[]> {
    return this.itemsService.getAll();
  }

  @Get(":id")
  async getOne(
    @Param("id", NonEmptyStringPipe, MongodbIdValidationPipe) id: string
  ): Promise<ItemInterface | null> {
    return await this.itemsService.getOne(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(itemValidationSchema)) item: ItemValidationDto
  ): Promise<ItemInterface> {
    return this.itemsService.create(item);
  }

  @Put(":id")
  update(
    @Param("id", NonEmptyStringPipe, MongodbIdValidationPipe) id: string,
    @Body(new ZodValidationPipe(itemValidationSchema)) item: ItemValidationDto
  ): Promise<ItemInterface | null> {
    return this.itemsService.update(id, item);
  }

  @Patch(":id")
  updatePartial(
    @Param("id", NonEmptyStringPipe, MongodbIdValidationPipe) id: string,
    @Body(new ZodValidationPipe(partialItemValidationSchema))
    item: PartialItemValidationDto
  ): Promise<ItemInterface | null> {
    return this.itemsService.updatePartial(id, item);
  }

  @Delete(":id")
  delete(
    @Param("id", NonEmptyStringPipe, MongodbIdValidationPipe) id: string
  ): Promise<ItemInterface | null> {
    return this.itemsService.delete(id);
  }
}
