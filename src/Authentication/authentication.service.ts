import { LoginDto } from "./dto/Login";
import { CreateUserDto } from "./dto/Register";
import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.model";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthenticationService {
    private readonly logger = new Logger(AuthenticationService.name);
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    private generateToken(user: any) {
        const secret = this.configService.get<string>('JWT_SECRET');
        return this.jwtService.sign({
            sub: user._id,
            email: user.email,
        }, { secret });
    }

    async register(createUserDto: CreateUserDto) {
        let isExistingUser = await this.findOneByEmail(createUserDto.email)
        if (isExistingUser) {
            this.logger.error('User already exists');
            throw new BadRequestException('User already exists');
        }
        const newUser = await this.userModel.create({
            email: createUserDto.email,
            name: createUserDto.name,
            password: createUserDto.password
        });

        await newUser.save();
        const accessToken = this.generateToken(newUser);
        return {
            message: 'User registered successfully',
            accessToken
        };
    }

    async login(loginDto: LoginDto) {
        const existingUser: User = await this.findOneByEmail(loginDto.email)
        if (!existingUser) {
            this.logger.error('User not found');
            throw new BadRequestException('User not found');
        }
        const isMatch = await existingUser.checkPassword(loginDto.password);
        if (!isMatch) {
            this.logger.error('Password is incorrect!');
            throw new UnauthorizedException("Incorrect password");
        }
        const accessToken = this.generateToken(existingUser);
        return {
            message: 'User logged in successfully',
            accessToken
        };
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email: email });
    }

    async getAllUsers() {
        return this.userModel.find();
    }
}
