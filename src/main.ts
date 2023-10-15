import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from 'cookie-parser';

async function start() {
	const PORT = process.env.PORT || 3000;
	const app = await NestFactory.create(AppModule)

	app.use(cookieParser())

	app.enableCors({
		origin: 'http://localhost:3002', // Replace with the origin(s) of your frontend
		credentials: true, // Enable credentials (cookies, authorization headers)
	  });

	await app.listen(PORT, () => {
		console.log(`Server started working on PORT = ${PORT}`);
	})
}

start();
