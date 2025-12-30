import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InquiryResolver } from './inquiry.resolver';
import { InquiryService } from './inquiry.service';
import InquirySchema from '../../schemas/Inquiry.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ProductModule } from '../product/product.module';
import ProductSchema from '../../schemas/Product.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Inquiry', schema: InquirySchema },
			{ name: 'Product', schema: ProductSchema },
		]),
		AuthModule,
		MemberModule,
	],
	providers: [InquiryResolver, InquiryService],
	exports: [InquiryService],
})
export class InquiryModule {}
