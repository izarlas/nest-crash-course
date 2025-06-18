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
  const mockValidItemId = "000000000000000000000000";
  const mockInvalidId = "abc1";
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

    it("returns HttpStatus code 400 when id is not a valid mongodb id", async () => {
      const response = await request(app.getHttpServer()).get(
        `${itemsApiUrl}/${mockInvalidId}`
      );

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Invalid mongo db id format",
        error: "Bad Request",
        statusCode: 400,
      });
    });

    it("returns HttpStatus code 404 NOT_FOUND with custom error message 'Item not found' when item by id is not found", async () => {
      await itemModel.create(mockItem);
      const response = await request(app.getHttpServer()).get(
        `${itemsApiUrl}/${mockValidItemId}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({
        statusCode: 404,
        message: "Item not found",
        errorCode: "ITEM_NOT_FOUND",
      });
    });
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

    it("returns HttpStatus code 400 when body is missing name", async () => {
      const response = await request(app.getHttpServer())
        .post(itemsApiUrl)
        .send({
          description: mockItem.description,
          quantity: mockItem.quantity,
        });

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Validation failed",
        error: "Bad Request",
        statusCode: 400,
      });
    });

    it("returns HttpStatus code 400 when body is missing description", async () => {
      const response = await request(app.getHttpServer())
        .post(itemsApiUrl)
        .send({
          name: mockItem.name,
          quantity: mockItem.quantity,
        });

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Validation failed",
        error: "Bad Request",
        statusCode: 400,
      });
    });

    it("returns HttpStatus code 400 when body is missing quantity", async () => {
      const response = await request(app.getHttpServer())
        .post(itemsApiUrl)
        .send({
          name: mockItem.name,
          description: mockItem.description,
        });

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Validation failed",
        error: "Bad Request",
        statusCode: 400,
      });
    });
  });

  describe("update", () => {
    it("updates existing item by id", async () => {
      await itemModel.create(mockItem);
      const foundItem = await itemModel.findOne({ name: mockItem.name });
      const foundItemId = foundItem!._id;

      const updateItem = {
        name: "Updated item",
        description: "An updated item",
        quantity: 1,
      };

      const response = await request(app.getHttpServer())
        .put(`${itemsApiUrl}/${foundItemId}`)
        .send(updateItem);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.name).toBe(updateItem.name);
      expect(response.body.description).toBe(updateItem.description);
      expect(response.body.quantity).toBe(updateItem.quantity);
    });

    it("returns HttpStatus code 400 when body is missing name", async () => {
      await itemModel.create(mockItem);
      const foundItem = await itemModel.findOne({ name: mockItem.name });
      const foundItemId = foundItem!._id;

      const updateItem = {
        description: "An updated item",
        quantity: 1,
      };

      const response = await request(app.getHttpServer())
        .put(`${itemsApiUrl}/${foundItemId}`)
        .send(updateItem);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Validation failed",
        error: "Bad Request",
        statusCode: 400,
      });
    });

    it("returns HttpStatus code 400 when body is missing description", async () => {
      await itemModel.create(mockItem);
      const foundItem = await itemModel.findOne({ name: mockItem.name });
      const foundItemId = foundItem!._id;

      const updateItem = {
        name: "Updated item",
        quantity: 1,
      };

      const response = await request(app.getHttpServer())
        .put(`${itemsApiUrl}/${foundItemId}`)
        .send(updateItem);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Validation failed",
        error: "Bad Request",
        statusCode: 400,
      });
    });

    it("returns HttpStatus code 400 when body is missing quantity", async () => {
      await itemModel.create(mockItem);
      const foundItem = await itemModel.findOne({ name: mockItem.name });
      const foundItemId = foundItem!._id;

      const updateItem = {
        name: "Updated item",
        description: "An updated item",
      };

      const response = await request(app.getHttpServer())
        .put(`${itemsApiUrl}/${foundItemId}`)
        .send(updateItem);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Validation failed",
        error: "Bad Request",
        statusCode: 400,
      });
    });

    it("returns HttpStatus code 404 NOT_FOUND with custom error message 'Item not found' when item by id is not found", async () => {
      await itemModel.create(mockItem);
      const item = {
        name: "Test Item",
        description: "A test item",
        quantity: 20,
      };

      const response = await request(app.getHttpServer())
        .put(`${itemsApiUrl}/${mockValidItemId}`)
        .send(item);

      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({
        statusCode: 404,
        message: "Item not found",
        errorCode: "ITEM_NOT_FOUND",
      });
    });

    it("returns HttpStatus code 400 when id is not a valid mongodb id", async () => {
      const response = await request(app.getHttpServer())
        .put(`${itemsApiUrl}/${mockInvalidId}`)
        .send(mockItem);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Invalid mongo db id format",
        error: "Bad Request",
        statusCode: 400,
      });
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

    it("returns HttpStatus code 404 NOT_FOUND with custom error message 'Item not found' when item by id is not found", async () => {
      await itemModel.create(mockItem);
      const response = await request(app.getHttpServer()).delete(
        `${itemsApiUrl}/${mockValidItemId}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({
        statusCode: 404,
        message: "Item not found",
        errorCode: "ITEM_NOT_FOUND",
      });
    });

    it("returns HttpStatus code 400 when id is not a valid mongodb id", async () => {
      await itemModel.create(mockItem);
      const response = await request(app.getHttpServer())
        .delete(`${itemsApiUrl}/${mockInvalidId}`)
        .send(mockItem);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Invalid mongo db id format",
        error: "Bad Request",
        statusCode: 400,
      });
    });
  });
});
