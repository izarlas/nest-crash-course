import { Injectable } from "@nestjs/common";
import { ItemInterface } from "./interfaces/item.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel("Item") private readonly itemModel: Model<ItemInterface>
  ) {}

  async getAll(): Promise<ItemInterface[]> {
    return await this.itemModel.find();
  }

  async getOne(id: string): Promise<ItemInterface | null> {
    return await this.itemModel.findById(id);
  }

  async create(item: ItemInterface): Promise<ItemInterface> {
    const newItem = new this.itemModel(item);

    return await newItem.save();
  }

  async update(id: string, item: ItemInterface): Promise<ItemInterface | null> {
    return await this.itemModel.findByIdAndUpdate(id, item, { new: true });
  }

  async delete(id: string): Promise<ItemInterface | null> {
    return await this.itemModel.findByIdAndDelete(id);
  }
}
