import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	PRODUCT = 'PRODUCT',
	EVENT = 'EVENT',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
