import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthService {
//     constructor(
//         @InjectRepository(User)
//         private userRepository: Repository<User>
//     ) { }

//     async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
//         const { username, password } = authCredentialsDto;
//         const user = this.userRepository.create({ username, password });
//         await this.userRepository.save(user);
        
//     }
//     async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
//             return this.userRepository.createUser(authCredentialsDto);
//         }
//     }
    

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({ username, password: hashedPassword });
        
        /* 유저 이름 중복성 검사 */
        try{
            await this.userRepository.save(user);
        } catch (error) {
            console.log('error', error);
            if (error.code === '23505') {
                throw new ConflictException('Existing username');
            } else {
                throw new InternalServerErrorException();
            }
        }
        await this.userRepository.save(user);
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        // Directly call createUser method of AuthService
        return this.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({ where: {username} });

        if(user && (await bcrypt.compare(password, user.password))) {
            // 유저 토큰 생성 ( Secret + Payload )
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        } else {
            throw new UnauthorizedException('login failed')
        }
    }
}
