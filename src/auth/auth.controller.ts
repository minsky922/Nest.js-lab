import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from './dto/get-user.decorator';
import {
    ApiOperation, ApiTags,
    ApiConsumes, ApiBody, ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('Auth-JWT')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    //localhost:3000/auth/signup
    @Post('/signup')
    @ApiOperation({ summary: '회원가입' })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    description: "유저 이름"
                },
                password: {
                    type: 'string',
                    description: "비밀번호  "
                },
            },
        },
    })
    signUp(@Body(ValidationPipe) authcredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authcredentialsDto);
    }

    @Post('/signin')
    @ApiOperation({ summary: '로그인' })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    description: "유저 이름"
                },
                password: {
                    type: 'string',
                    description: "비밀번호"
                },
            },
        },
    })
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '유저정보 가져오기',
        description: 'Passport, Jwt 이용해서 토큰 인증 후 유저 정보 가져오기 '
    })
    test(@GetUser() user: User) {
        console.log('user', user);
    }
    // test(@Req() req) {
    //     console.log(req);
    // }
}