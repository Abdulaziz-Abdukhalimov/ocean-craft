import { registerEnumType } from '@nestjs/graphql';

export enum ProductCategory {
	BOAT = 'BOAT',
	SNOWMOIBILE = 'SNOWMOBILE',
	ATV = 'ATV',
	JET_SKIS = 'JET_SKIS',
	TERRAIN_VEHICLES = 'TERRAIN_VEHICLES',
	ENGINES = 'ENGINES',
	OTHER = 'OTHER',
}
registerEnumType(ProductCategory, {
	name: 'ProductCategory',
});

export enum ProductCondition {
	NEW = 'NEW',
	USED = 'USED',
}
registerEnumType(ProductCondition, {
	name: 'ProductCondition',
});

export enum ProductStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(ProductStatus, {
	name: 'ProductStatus',
});

export enum ProductCurrency {
	USD = 'USD',
	KRW = 'KRW',
	EUR = 'EUR',
}
registerEnumType(ProductCurrency, {
	name: 'ProductCurrency',
});

export enum InquiryItemType {
	PRODUCT = 'Product',
	EVENT = 'Event',
}
registerEnumType(InquiryItemType, {
	name: 'InquiryItemType',
});
