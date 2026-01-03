import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistResolver } from './wishlist.resolver';
import { WishlistService } from './wishlist.service';
import WishlistSchema from '../../schemas/Wishlist.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import ProductSchema from '../../schemas/Product.model';
import EventSchema from '../../schemas/Event.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Wishlist', schema: WishlistSchema },
			{ name: 'Product', schema: ProductSchema },
			{ name: 'Event', schema: EventSchema },
		]),
		AuthModule,
		MemberModule,
	],
	providers: [WishlistResolver, WishlistService],
	exports: [WishlistService],
})
export class WishlistModule {}
