import { ObjectId } from 'bson';
import { T } from './types/common';

export const availableAgentsSort = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];
export const availableMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews'];
export const availableOptions = ['productBarter', 'productRent'];

/**  IMAGE CONFIGURATION **/
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { pipeline } from 'stream';

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForCloudinary = (filename: string) => {
	return uuidv4(); // No extension needed
};

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};

export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = '$_id') => {
	return {
		$lookup: {
			from: 'likes',
			let: {
				localLikeRefId: targetRefId,
				localMemberId: memberId,
				localMyFavorite: true,
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [{ $eq: ['$likeRefId', '$$localLikeRefId'] }, { $eq: ['$memberId', '$$localMemberId'] }],
						},
					},
				},
				{
					$project: {
						_id: 0,
						memberId: 1,
						likeRefId: 1,
						myFavorite: '$$localMyFavorite',
					},
				},
			],
			as: 'meLiked',
		},
	};
};

export const availableProductSorts = [
	'createdAt',
	'updatedAt',
	'productLikes',
	'productViews',
	'productRank',
	'productPrice',
];

export const availableEventSorts = ['createdAt', 'updatedAt', 'eventLikes', 'eventViews'];
export const availableCommentSorts = ['createdAt', 'updatedAt'];
