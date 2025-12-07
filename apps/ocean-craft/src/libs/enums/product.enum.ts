import { registerEnumType } from '@nestjs/graphql';

export enum ProductCategory {
	YACHT = 'YACHT',
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

export enum ProductPriceType {
	FORSALE = 'FORSALE',
	RENT = 'RENT',
}
registerEnumType(ProductPriceType, {
	name: 'ProductPriceType',
});

export enum ProductRentPeriod {
	HOUR = 'HOUR',
	DAY = 'DAY',
	WEEK = 'WEEK',
	MONTH = 'MONTH',
}
registerEnumType(ProductRentPeriod, {
	name: 'ProductRentPeriod',
});
