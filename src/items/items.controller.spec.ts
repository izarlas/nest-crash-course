import { Test, TestingModule } from "@nestjs/testing";
import { ItemsController } from "./items.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { INestApplication } from "@nestjs/common";
import { ItemSchema } from "./schemas/item.schema";
import { ItemsService } from "./items.service";
import request from "supertest";
import mongoose, { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { ItemInterface } from "./interfaces/item.interface";

describe("Items APIs", () => {
  const itemsApiUrl = "/items";
  const mockItem = {
    name: "Test Item",
    description: "A test item",
    quantity: 42,
  };
  const mockItemId = "000000000000000000000000";
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let itemModel: Model<ItemInterface>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: "Item", schema: ItemSchema }]),
      ],
      controllers: [ItemsController],
      providers: [ItemsService],
    }).compile();

    app = testModule.createNestApplication();
    await app.init();

    itemModel = app.get(getModelToken("Item"));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await app.close();
  });

  describe("getAll", () => {
    it("returns all items", async () => {
      await itemModel.create(mockItem);

      const response = await request(app.getHttpServer()).get(itemsApiUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe(mockItem.name);
      expect(response.body[0].description).toBe(mockItem.description);
      expect(response.body[0].quantity).toBe(mockItem.quantity);
    });

    it("returns empty array, when no items are created", async () => {
      const response = await request(app.getHttpServer()).get(itemsApiUrl);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([]);
    });
  });

  describe("getOne", () => {
    it("returns item by id", async () => {
      await itemModel.create(mockItem);

      const foundItem = await itemModel.findOne({ name: mockItem.name });
      const foundItemId = foundItem!._id;
      const response = await request(app.getHttpServer()).get(
        `${itemsApiUrl}/${foundItemId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(mockItem.name);
      expect(response.body.description).toBe(mockItem.description);
      expect(response.body.quantity).toBe(mockItem.quantity);
      expect(response.body).toHaveProperty("_id", foundItemId.toString());
    });

    it("returns empty response, when item by id is not found", async () => {
      const response = await request(app.getHttpServer()).get(
        `${itemsApiUrl}/${mockItemId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });

    // Todo handle invalid id length
    // Todo handle invalid id type
  });

  describe("create", () => {
    it("creates new item", async () => {
      const response = await request(app.getHttpServer())
        .post(itemsApiUrl)
        .send(mockItem);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.name).toBe(mockItem.name);
      expect(response.body.description).toBe(mockItem.description);
      expect(response.body.quantity).toBe(mockItem.quantity);
    });
  });

  describe("update", () => {
    it("updates existing item by id", async () => {
      await itemModel.create(mockItem);
      const foundItem = await itemModel.findOne({ name: mockItem.name });
      const foundItemId = foundItem!._id;

      const updatedItem = {
        name: "Updated item",
        description: "An updated item",
        quantity: 1,
      };

      const response = await request(app.getHttpServer())
        .put(`${itemsApiUrl}/${foundItemId}`)
        .send(updatedItem);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.name).toBe(updatedItem.name);
      expect(response.body.description).toBe(updatedItem.description);
      expect(response.body.quantity).toBe(updatedItem.quantity);
    });
    it("does not create a new item, when item id is not found", async () => {
      const item = {
        name: "Test Item",
        description: "A test item",
        quantity: 20,
      };
      const response = await request(app.getHttpServer())
        .put(`${itemsApiUrl}/${mockItemId}`)
        .send(item);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });
  describe("delete", () => {
    it("deletes item by id", async () => {
      await itemModel.create(mockItem);

      const foundItem = await itemModel.findOne({ name: mockItem.name });
      const foundItemId = foundItem!._id;

      const response = await request(app.getHttpServer()).delete(
        `${itemsApiUrl}/${foundItemId}`
      );

      expect(response.status).toBe(200);
      const itemAfterDelete = await itemModel.findById(foundItemId);
      expect(itemAfterDelete).toBeNull();
    });
    it("returns null, when item by id is not found", async () => {
      const response = await request(app.getHttpServer()).delete(
        `${itemsApiUrl}/${mockItemId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });
});
