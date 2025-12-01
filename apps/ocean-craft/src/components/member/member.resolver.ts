import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { Member, Members } from '../../libs/dto/member/member';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decoraters/authMember.decorater';
import { Roles } from '../auth/decoraters/roles.decorater';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { getSerialForCloudinary, shapeIntoMongoObjectId, validMimeTypes } from '../../libs/config';

import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { uploadToCloudinary } from '../../libs/utils/cloudinary-uploader';
import { Message } from '../../libs/enums/common.enum';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => Member)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation: signup');
		return this.memberService.signup(input);
	}

	@Mutation(() => Member)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation: login');
		return this.memberService.login(input);
	}

	@UseGuards(AuthGuard)
	@Query(() => String)
	public async chechAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: chechAuth');
		console.log(memberNick);
		return `Hi ${memberNick}`;
	}

	@Roles(MemberType.USER, MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query(() => String)
	public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
		console.log('Query: checAuthRoles');
		return `Hi ${authMember.memberNick} , you are ${authMember.memberType} and your id : ${authMember._id}`;
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Member)
	public async updateMember(
		@Args('input') input: MemberUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Member> {
		console.log('Mutation: updateMember');
		delete input._id;
		return await this.memberService.updateMember(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Member)
	public async getMember(@Args('memberId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Member> {
		console.log('Query: getMember');
		const targetId = shapeIntoMongoObjectId(input);
		return await this.memberService.getMember(memberId, targetId);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Members)
	public async getAgents(@Args('input') input: AgentsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Members> {
		console.log('Query: getAgents');
		return await this.memberService.getAgents(memberId, input);
	}

	/** ADMIN  */
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Members)
	public async getAllMembersByAdmin(@Args('input') input: MembersInquiry): Promise<Members> {
		console.log('mutation: getAllMembersByAdmin');
		return await this.memberService.getAllMembersByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Member)
	public async updateMemberByAdmin(
		@Args('input') input: MemberUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Member> {
		console.log('Mutation: updateMemberByAdmin');
		return await this.memberService.updateMemberByAdmin(input);
	}

	// ------- UPLOADER ------
	@UseGuards(AuthGuard)
	@Mutation(() => String)
	public async imageUploader(
		@Args({ name: 'file', type: () => GraphQLUpload })
		{ createReadStream, filename, mimetype }: FileUpload,
		@Args('target') target: string, // e.g., "members", "products"
	): Promise<string> {
		console.log('Mutation: imageUploader');

		if (!filename) throw new Error(Message.UPLOAD_FAILED);

		const validMime = validMimeTypes.includes(mimetype);
		if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

		// Generate unique filename (without extension)
		const imageName = getSerialForCloudinary(filename);

		// Get stream
		const stream = createReadStream();

		try {
			// Upload to Cloudinary
			const cloudinaryUrl = await uploadToCloudinary(stream, target, imageName);
			return cloudinaryUrl;
		} catch (error) {
			console.error('Upload error:', error);
			throw new Error(Message.UPLOAD_FAILED);
		}
	}

	@UseGuards(AuthGuard)
	@Mutation(() => [String])
	public async imagesUploader(
		@Args('files', { type: () => [GraphQLUpload] })
		files: Promise<FileUpload>[],
		@Args('target') target: string, // e.g., "products"
	): Promise<string[]> {
		console.log('Mutation: imagesUploader');

		const uploadedImages: string[] = [];

		const promisedList = files.map(async (img: Promise<FileUpload>, index: number) => {
			try {
				const { filename, mimetype, createReadStream } = await img;

				const validMime = validMimeTypes.includes(mimetype);
				if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

				const imageName = getSerialForCloudinary(filename);
				const stream = createReadStream();

				// Upload to Cloudinary
				const cloudinaryUrl = await uploadToCloudinary(stream, target, imageName);

				uploadedImages[index] = cloudinaryUrl;
			} catch (err) {
				console.log('Error uploading file:', err);
			}
		});

		await Promise.all(promisedList);
		return uploadedImages;
	}
}
