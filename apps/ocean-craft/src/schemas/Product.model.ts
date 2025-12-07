import { Schema } from 'mongoose';
import { ref } from 'process';
import {
	ProductCategory,
	ProductCondition,
	ProductCurrency,
	ProductPriceType,
	ProductRentPeriod,
	ProductStatus,
} from '../libs/enums/product.enum';

const ProductSchema = new Schema(
	{
		sellerId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
		productCategory: {
			type: String,
			enum: ProductCategory,
			required: true,
		},
		productCondition: {
			type: String,
			enum: ProductCondition,
			default: ProductCondition.NEW,
			required: true,
		},
		productStatus: {
			type: String,
			enum: ProductStatus,
			default: ProductStatus.ACTIVE,
		},
		productTitle: {
			type: String,
			required: true,
		},
		productDescription: {
			type: String,
		},
		productBrand: {
			type: String,
			required: true,
		},
		productModel: {
			type: String,
			required: true,
		},
		productEngineType: {
			type: String,
		},
		productSpeed: {
			type: Number,
		},
		productLength: {
			type: Number,
		},
		productPriceType: {
			type: String,
			enum: ProductPriceType,
			required: true,
		},
		productRentPeriod: {
			type: String,
			enum: ProductRentPeriod,
			required: function () {
				return this.productPriceType === ProductPriceType.RENT;
			},
		},
		productPrice: {
			type: Number,
			required: true,
		},
		productCurrency: {
			type: String,
			default: ProductCurrency.KRW,
		},
		productImages: {
			type: [String],
			required: true,
		},
		productAddress: {
			type: String,
			required: true,
		},
		productViews: {
			type: Number,
			default: 0,
		},

		productLikes: {
			type: Number,
			default: 0,
		},

		productComments: {
			type: Number,
			default: 0,
		},
		productRank: {
			type: Number,
			default: 0,
		},
		productRent: {
			type: Boolean,
			default: false,
		},
		buildAt: {
			type: Date,
		},
		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'products' },
);
ProductSchema.index({ productCategory: 1, productTitle: 1, productAddress: 1, productPrice: 1, productPriceType: 1 });
export default ProductSchema;
