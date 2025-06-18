import { HttpStatus, Injectable } from "@nestjs/common";
import { ItemInterface } from "./interfaces/item.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppException } from "../shared/exceptions/app.exception";

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel("Item") private readonly itemModel: Model<ItemInterface>
  ) {}

  async getAll(): Promise<ItemInterface[]> {
    return await this.itemModel.find();
  }

  async getOne(id: string): Promise<ItemInterface | null> {
    return await this.getItemByIdOrThrow(id);
  }

  async create(item: ItemInterface): Promise<ItemInterface> {
    const newItem = new this.itemModel(item);

    return await newItem.save();
  }

  async update(id: string, item: ItemInterface): Promise<ItemInterface | null> {
    const updatedItem = await this.itemModel.findByIdAndUpdate(id, item, {
      new: true,
    });

    return this.ensureItem(updatedItem);
  }

  async updatePartial(
    id: string,
    item: Partial<ItemInterface>
  ): Promise<ItemInterface | null> {
    const updatedItem = await this.itemModel.findByIdAndUpdate(id, item, {
      new: true,
    });

    return this.ensureItem(updatedItem);
  }

  async delete(id: string): Promise<ItemInterface | null> {
    const deletedItem = await this.itemModel.findByIdAndDelete(id);

    return this.ensureItem(deletedItem);
  }

  private async getItemByIdOrThrow(id: string): Promise<ItemInterface | null> {
    const item = await this.itemModel.findById(id);

    return this.ensureItem(item);
  }

  private ensureItem(item: ItemInterface | null): ItemInterface | null {
    if (!item) {
      throw new AppException(
        "Item not found",
        HttpStatus.NOT_FOUND,
        "ITEM_NOT_FOUND"
      );
    }

    return item;
  }
}
