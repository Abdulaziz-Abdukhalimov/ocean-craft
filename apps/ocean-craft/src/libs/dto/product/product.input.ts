import { Field, InputType, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, IsNumber, Min, IsBoolean, IsArray, IsEnum, IsIn } from 'class-validator';
import { ProductCategory, ProductCondition, ProductStatus, ProductCurrency } from '../../enums/product.enum';
import { ObjectId } from 'mongoose';
import { availableProductSorts } from '../../config';
import { Direction } from '../../enums/common.enum';

@InputType()
export class ProductInput {
	@IsNotEmpty()
	@Field(() => ProductCategory)
	productCategory: ProductCategory;

	@IsNotEmpty()
	@Field(() => ProductCondition)
	productCondition: ProductCondition;

	@IsNotEmpty()
	@Length(5, 200)
	@Field(() => String)
	productTitle: string;

	@IsNotEmpty()
	@Length(3, 50)
	@Field(() => String)
	productBrand: string;

	@IsNotEmpty()
	@Length(3, 50)
	@Field(() => String)
	productModel: string;

	@IsNotEmpty()
	@Field(() => Number)
	productPrice: number;

	@IsNotEmpty()
	@Field(() => ProductCurrency)
	productCurrency: ProductCurrency;

	@IsNotEmpty()
	@Field(() => [String])
	productImages: string[];

	@IsNotEmpty()
	@Length(5, 200)
	@Field(() => String)
	productAddress: string;

	@IsOptional()
	@Length(10, 2000)
	@Field(() => String, { nullable: true })
	productDescription?: string;

	@IsOptional()
	@IsBoolean()
	@Field(() => Boolean, { nullable: true })
	productRent?: boolean;

	sellerId?: ObjectId;
}

@InputType()
export class PriceRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class PeriodsRange {
	@Field(() => Date)
	start: Date;

	@Field(() => Date)
	end: Date;
}

@InputType()
class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	sellerId?: ObjectId;

	@IsOptional()
	@Field(() => [ProductCategory], { nullable: true })
	categoryList?: ProductCategory[];

	@IsOptional()
	@Field(() => [ProductCondition], { nullable: true })
	conditionList?: ProductCondition[];

	@IsOptional()
	@Field(() => [ProductCurrency], { nullable: true })
	currencyList?: ProductCurrency[];

	@IsOptional()
	@Field(() => PriceRange, { nullable: true })
	pricesRange?: PriceRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	location?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	productRent?: boolean;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class ProductsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch;
}

@InputType()
class SPISearch {
	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;

	@IsOptional()
	@Field(() => [ProductCategory], { nullable: true })
	categoryList?: ProductCategory[];
}

@InputType()
export class SellerProductsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => SPISearch)
	search: SPISearch;
}

@InputType()
class APISearch {
	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;

	@IsOptional()
	@Field(() => [ProductCategory], { nullable: true })
	categoryList?: ProductCategory[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	sellerId?: ObjectId;
}

@InputType()
export class AllProductsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => APISearch)
	search: APISearch;
}

@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
