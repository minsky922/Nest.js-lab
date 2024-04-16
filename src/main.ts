import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './utils/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // //웹 페이지를 새로고침을 해도 Token 값 유지
  // const swaggerCustomOptions: SwaggerCustomOptions = {
  //   swaggerOptions: {
  //     persistAuthorization: true,
  //   },
  // };

  // const config = new DocumentBuilder()
  //   .setTitle('Swagger API List')
  //   .setDescription('Swagger API description')
  //   .setVersion('1.0.0')
  //   .addTag('swagger')
  //   //JWT 토큰 설정
  //   .addBearerAuth(
  //     {
  //       type: 'http',
  //       scheme: 'bearer',
  //       name: 'JWT',
  //       in: 'header',
  //     },
  //     'access-token',
  //   )
  //   .build();

  // // config를 바탕으로 swagger document 생성
  // const document = SwaggerModule.createDocument(app, config);
  // // Swagger UI에 대한 path를 연결함
  // // .setup('swagger ui endpoint', app, swagger_document)
  // SwaggerModule.setup('api', app, document, swaggerCustomOptions);
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
