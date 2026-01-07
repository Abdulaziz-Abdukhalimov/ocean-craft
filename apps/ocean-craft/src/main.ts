import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress } from 'graphql-upload';
import { v2 as cloudinary } from 'cloudinary';

async function bootstrap() {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	const app = await NestFactory.create(AppModule);
	app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 5 }));

	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new LoggingInterceptor());

	app.enableCors({ origin: true, credentials: true });

	await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
