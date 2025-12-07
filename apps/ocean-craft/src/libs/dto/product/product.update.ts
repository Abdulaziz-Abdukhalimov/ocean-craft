import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import {
	ProductCategory,
	ProductCondition,
	ProductCurrency,
	ProductPriceType,
	ProductRentPeriod,
	ProductStatus,
} from '../../enums/product.enum';

@InputType()
export class ProductUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => ProductCategory, { nullable: true })
	productCategory?: ProductCategory;

	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;

	@IsOptional()
	@Field(() => ProductCondition, { nullable: true })
	productCondition?: ProductCondition;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	productTitle?: string;

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	productDescription?: string;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	productBrand?: string;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	productModel?: string;

	@IsOptional()
	@Length(3, 50)
	@Field(() => String, { nullable: true })
	productEngineType?: string;

	@IsOptional()
	@Min(0)
	@Field(() => Number, { nullable: true })
	productSpeed?: number;

	@IsOptional()
	@Min(0)
	@Field(() => Number, { nullable: true })
	productLength?: number;

	@IsOptional()
	@Field(() => ProductPriceType, { nullable: true })
	productPriceType?: ProductPriceType;

	@IsOptional()
	@Field(() => ProductRentPeriod, { nullable: true })
	productRentPeriod?: ProductRentPeriod;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	productPrice?: number;

	@IsOptional()
	@Field(() => ProductCurrency, { nullable: true })
	productCurrency?: ProductCurrency;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	productImages?: string[];

	@IsOptional()
	@Length(5, 200)
	@Field(() => String, { nullable: true })
	productAddress?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	productRent?: boolean;

	soldAt?: Date;

	deletedAt?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	buildAt?: Date;
}
