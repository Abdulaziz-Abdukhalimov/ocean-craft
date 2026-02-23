import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from 'apps/ocean-craft/src/libs/dto/event/event';
import { Member } from 'apps/ocean-craft/src/libs/dto/member/member';
import { Product } from 'apps/ocean-craft/src/libs/dto/product/product';
import { EventStatus } from 'apps/ocean-craft/src/libs/enums/event.enum';
import { MemberStatus, MemberType } from 'apps/ocean-craft/src/libs/enums/member.enum';
import { ProductStatus } from 'apps/ocean-craft/src/libs/enums/product.enum';
import { Model } from 'mongoose';

@Injectable()
export class OceanCraftBatchService {
	constructor(
		@InjectModel('Product') private readonly productModel: Model<Product>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		@InjectModel('Event') private readonly eventModel: Model<Event>,
	) {}

	public async batchRollback(): Promise<void> {
		await this.productModel.updateMany({ propertyStatus: ProductStatus.ACTIVE }, { productRank: 0 }).exec();

		await this.memberModel
			.updateMany({ memberStatus: MemberStatus.ACTIVE, memberType: MemberType.AGENT }, { memberRank: 0 })
			.exec();
	}

	public async batchTopProducts(): Promise<void> {
		const products: Product[] = await this.productModel
			.find({
				productStatus: ProductStatus.ACTIVE,
				productRank: 0,
			})
			.exec();

		const promisedList = products.map(async (ele: Product) => {
			const { _id, productLikes: productLikes, productViews: productViews } = ele;
			const rank = productLikes * 10 + productViews * 10;
			return await this.productModel.findByIdAndUpdate(_id, { productRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async batchTopEvents(): Promise<void> {
		const events: Event[] = await this.eventModel
			.find({
				eventStatus: EventStatus.ACTIVE,
				eventRank: 0,
			})
			.exec();

		const promisedList = events.map(async (ele: Event) => {
			const { _id, eventLikes: eventLikes, eventViews: eventViews } = ele;
			const rank = eventLikes * 15 + eventViews * 15;
			return await this.eventModel.findByIdAndUpdate(_id, { eventRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async topAgents(): Promise<void> {
		const agents: Member[] = await this.memberModel
			.find({
				memberType: MemberType.AGENT,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = agents.map(async (ele: Member) => {
			const { _id, memberProducts, memberLikes, memberEvents, memberViews } = ele;
			const rank = memberProducts * 4 + memberEvents * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promisedList);
	}

	getHello(): string {
		return 'Hello World from Nestar Batch!';
	}
}
