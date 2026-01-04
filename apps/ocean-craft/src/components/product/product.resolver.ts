import { Resolver, Query } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Roles } from '../auth/decoraters/roles.decorater';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Args, Mutation } from '@nestjs/graphql';
import { AuthMember } from '../auth/decoraters/authMember.decorater';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Product, Products } from '../../libs/dto/product/product';
import { ObjectId } from 'mongoose';
import {
	AllProductsInquiry,
	OrdinaryInquiry,
	ProductInput,
	ProductsInquiry,
	SellerProductsInquiry,
} from '../../libs/dto/product/product.input';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { ProductUpdate } from '../../libs/dto/product/product.update';
import { ProductPriceType } from '../../libs/enums/product.enum';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Product)
	public async createProduct(
		@Args('input') input: ProductInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Product> {
		console.log('Mutation: createProduct');
		input.memberId = memberId;
		if (input.productPriceType === ProductPriceType.RENT && !input.productRentPeriod) {
			throw new BadRequestException('Rent period is required for rental products');
		}
		return await this.productService.createProduct(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Product)
	public async getProduct(@Args('productId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Product> {
		console.log('query: getProduct');
		const propertyId = shapeIntoMongoObjectId(input);
		return await this.productService.getProduct(memberId, propertyId);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Product)
	public async updateProduct(
		@Args('input') input: ProductUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Product> {
		console.log('mutation: updateProduct');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.productService.updateProduct(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Products)
	public async getProducts(
		@Args('input') input: ProductsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Products> {
		console.log('Query: getProducts');
		return await this.productService.getProducts(memberId, input);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query(() => Products)
	public async getSellerProducts(
		@Args('input') input: SellerProductsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Products> {
		console.log('Query: getSellerProducts');
		return await this.productService.getSellerProducts(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Product)
	public async likeTargetProduct(
		@Args('productId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Product> {
		console.log('Mutation: likeTargetProduct');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.productService.likeTargetProduct(memberId, likeRefId);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Products)
	public async getFavoritesProducts(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Products> {
		console.log('Query: getFavorites');
		return await this.productService.getFavoritesProducts(memberId, input);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Products)
	public async getAllProductsByAdmin(
		@Args('input') input: AllProductsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Products> {
		console.log('Query: getAllProductsByAdmin');
		return await this.productService.getAllProductsByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Product)
	public async updateProductByAdmin(@Args('input') input: ProductUpdate): Promise<Product> {
		console.log('Muation: updateProductByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.productService.updateProductByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Product)
	public async removeProductByAdmin(@Args('propertyId') input: string): Promise<Product> {
		console.log('Mutation: removeProductByAdmin');
		const propertyId = shapeIntoMongoObjectId(input);
		return await this.productService.removeProductByAdmin(propertyId);
	}
}
