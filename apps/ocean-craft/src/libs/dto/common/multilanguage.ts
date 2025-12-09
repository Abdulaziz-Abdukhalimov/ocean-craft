import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

@InputType()
export class MultiLanguageInput {
	@IsNotEmpty()
	@Length(1, 500)
	@Field(() => String)
	ko: string;

	@IsOptional()
	@Length(1, 500)
	@Field(() => String, { nullable: true })
	en?: string;

	@IsOptional()
	@Length(1, 500)
	@Field(() => String, { nullable: true })
	ru?: string;

	@IsOptional()
	@Length(1, 500)
	@Field(() => String, { nullable: true })
	uz?: string;
}

@InputType()
export class MultiLanguageInputLong {
	@IsNotEmpty()
	@Length(1, 5000)
	@Field(() => String)
	ko: string;

	@IsOptional()
	@Length(1, 5000)
	@Field(() => String, { nullable: true })
	en?: string;

	@IsOptional()
	@Length(1, 5000)
	@Field(() => String, { nullable: true })
	ru?: string;

	@IsOptional()
	@Length(1, 5000)
	@Field(() => String, { nullable: true })
	uz?: string;
}
