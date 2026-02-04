import { Module } from '@nestjs/common';
import { OceanCraftBatchService } from './ocean-craft-batch.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OceanCraftBatchController } from './ocean-craft-batch.controller';
import { MongooseModule } from '@nestjs/mongoose';
import ProductSchema from 'apps/ocean-craft/src/schemas/Product.model';
import MemberSchema from 'apps/ocean-craft/src/schemas/Member.model';
import EventSchema from 'apps/ocean-craft/src/schemas/Event.model';

@Module({
	imports: [
		ConfigModule.forRoot(),
		DatabaseModule,
		ScheduleModule.forRoot(),
		MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
	],
	controllers: [OceanCraftBatchController],
	providers: [OceanCraftBatchService],
})
export class OceanCraftBatchModule {}
