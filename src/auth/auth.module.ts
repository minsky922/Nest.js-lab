import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { UserRepository } from './user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:'Secret1234', // 토큰을 만들때 이용하는 Secret 텍스트(아무거나 넣어도 됨)
      signOptions:{
        expiresIn: 60 * 60, //(1시간)정해진 시간 이후에는 토큰이 유효하지 않게 된다.
      }
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
