import { CreateUserDto } from "./dto/Register";
import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/Login";

@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiTags('Authentication')
    @ApiParam({ name: 'dto', type: CreateUserDto })
    @ApiResponse({
        status: 200,
        description: 'User registered successfully',
        schema: {
            properties: {
                message: {
                    type: 'string',
                    example: 'User registered successfully'
                },
                accessToken: {
                    type: 'string'
                }
            }
        }
    })
    @ApiBody({ type: CreateUserDto })
    async register(@Body() createUserDto: CreateUserDto) {

        return await this.authenticationService.register(createUserDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiTags('Authentication')
    @ApiParam({ name: 'dto', type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'User logged in successfully',
        schema: {
            properties: {
                message: {
                    type: 'string',
                    example: 'User logged in successfully'
                },
                accessToken: {
                    type: 'string'
                }
            }
        }
    })
    @ApiBody({ type: LoginDto })
    async login(@Body() dto: LoginDto) {
        return await this.authenticationService.login(dto);
    }

}   
