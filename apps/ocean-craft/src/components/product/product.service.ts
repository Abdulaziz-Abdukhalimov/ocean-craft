import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { Message } from '../../libs/enums/common.enum';
import { Product } from '../../libs/dto/product/product';
import { ProductInput } from '../../libs/dto/product/product.input';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel('Product') private readonly productModel: Model<Product>,
		private memberService: MemberService,
	) {}

	public async createProduct(input: ProductInput): Promise<Product> {
		try {
			const result = await this.productModel.create(input);
			//increase memberProperties
			await this.memberService.memberStatsEditor({ _id: result.sellerId, targetKey: 'memberProducts', modifier: 1 });
			return result;
		} catch (err) {
			console.log('Error , createProduct:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
}
