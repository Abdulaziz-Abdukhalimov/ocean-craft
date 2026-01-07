import { Field, Int, Float, ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import {
	ProductCategory,
	ProductCondition,
	ProductCurrency,
	ProductPriceType,
	ProductRentPeriod,
	ProductStatus,
} from '../../enums/product.enum';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
export class Product {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => ProductCategory)
	productCategory: ProductCategory;

	@Field(() => ProductCondition)
	productCondition: ProductCondition;

	@Field(() => ProductStatus)
	productStatus: ProductStatus;

	@Field(() => String)
	productTitle: string;

	@Field(() => String, { nullable: true })
	productDescription?: string;

	@Field(() => String)
	productBrand: string;

	@Field(() => String)
	productModel: string;

	@Field(() => String, { nullable: true })
	productEngineType?: string;

	@Field(() => Float, { nullable: true })
	productSpeed?: number;

	@Field(() => Float, { nullable: true })
	productLength?: number;

	@Field(() => ProductPriceType, { nullable: true })
	productPriceType: ProductPriceType;

	@Field(() => ProductRentPeriod, { nullable: true })
	productRentPeriod?: ProductRentPeriod;

	@Field(() => Float)
	productPrice: number;

	@Field(() => ProductCurrency)
	productCurrency: ProductCurrency;

	@Field(() => [String])
	productImages: string[];

	@Field(() => String)
	productAddress: string;

	@Field(() => Int)
	productViews: number;

	@Field(() => Int)
	productLikes: number;

	@Field(() => Int)
	productComments: number;

	@Field(() => Int)
	productRank: number;

	@Field(() => Boolean)
	productRent: boolean;

	@Field(() => String, { nullable: true })
	productBuildYear?: string;

	@Field(() => Date, { nullable: true })
	soldAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	// from aggregation
	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];
}

@ObjectType()
export class Products {
	@Field(() => [Product])
	list: Product[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
