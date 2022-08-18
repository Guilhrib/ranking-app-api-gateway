import { Body, Controller, Get, Logger, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('/api')
export class AppController {

  private logger = new Logger(AppController.name)
  private clientAdminProxy: ClientProxy 

  constructor() {
    this.clientAdminProxy = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          'amqp://user:9Z2p4x7aIlpa@3.84.61.97:5672/smart-ranking'
        ],
        queue: 'admin-backend'
      }
    })
  }

  /*
    the emit function returns a hot observable so
    there is no need to use async/await and the keyword return
  */
  @Post('/categorias')
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    this.logger.log(`categoria: ${JSON.stringify(criarCategoriaDto)}`)
    this.clientAdminProxy.emit('criar-categoria', criarCategoriaDto)
  }

  /*
    the send function returns a cold observable so
    there is no need to use async/await, but we need to explicitly
    use the keyword return
  */
  @Get('/categorias')
  consultarCategoria(@Query('idCategoria') _id: string): Observable<any> {
    this.logger.log(`id: ${_id ? JSON.stringify(_id) : 'empty'}`)
    return this.clientAdminProxy.send('consultar-categoria', _id ? _id : '')
  }
}
