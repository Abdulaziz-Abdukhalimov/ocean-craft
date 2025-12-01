import { Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Roles } from '../auth/decoraters/roles.decorater';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Args, Mutation } from '@nestjs/graphql';
import { AuthMember } from '../auth/decoraters/authMember.decorater';
import { UseGuards } from '@nestjs/common';
import { Product } from '../../libs/dto/product/product';
import { ObjectId } from 'mongoose';
import { ProductInput } from '../../libs/dto/product/product.input';

@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Product)
	public async createProperty(
		@Args('input') input: ProductInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Product> {
		console.log('Mutation: createProperty');
		input.sellerId = memberId;
		return await this.productService.createProperty(input);
	}
}
