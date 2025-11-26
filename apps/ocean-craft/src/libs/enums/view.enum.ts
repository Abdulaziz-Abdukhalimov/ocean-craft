import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	PRODUCT = 'PRODUCT',
	EVENT = 'EVENT',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
