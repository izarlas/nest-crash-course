import { Module } from "@nestjs/common";
import { ItemsModule } from "./items/items.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    ItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
