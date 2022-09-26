import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);

  const host = configService.get('app.http.host');
  const port = configService.get('app.http.port');
  const protocol = configService.get('app.http.protocol');
  const server = `${protocol}://${host}:${port}`;

  const options = new DocumentBuilder()
    .setTitle(configService.get('app.name'))
    .setDescription(configService.get('app.description'))
    .setVersion(configService.get('app.version'))
    .addBearerAuth({ bearerFormat: 'JWT', type: 'http', scheme: 'bearer' })
    .addServer(server)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
};
