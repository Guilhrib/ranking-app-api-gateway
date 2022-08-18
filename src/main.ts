import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExecptionFilter } from './filters/http-execption.filter';
import { TimeoutInterceptor } from './interceptors/Timeout.interceptor'
import * as momentTimezone from 'moment-timezone'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TimeoutInterceptor())
  app.useGlobalFilters(new AllExecptionFilter());
  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS')
  }
  await app.listen(8080);
}
bootstrap();
