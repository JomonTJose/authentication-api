import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/Register';
import { LoginDto } from './dto/Login';

describe('AuthenticationController', () => {
    let controller: AuthenticationController;
    let service: AuthenticationService;

    const mockResponse = {
        access_token: 'mock.jwt.token',
        user: {
            id: 'testId123',
            email: 'test@example.com',
            name: 'Test User',
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthenticationController],
            providers: [
                {
                    provide: AuthenticationService,
                    useValue: {
                        register: jest.fn().mockResolvedValue(mockResponse),
                        login: jest.fn().mockResolvedValue(mockResponse),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthenticationController>(AuthenticationController);
        service = module.get<AuthenticationService>(AuthenticationService);
    });

    describe('register', () => {
        const registerDto: CreateUserDto = {
            email: 'test@example.com',
            password: 'Password123!',
            name: 'Test User',
        };

        it('should call service.register with correct dto', async () => {
            const result = await controller.register(registerDto);

            expect(service.register).toHaveBeenCalledWith(registerDto);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('login', () => {
        const loginDto: LoginDto = {
            email: 'test@example.com',
            password: 'Password123!',
        };

        it('should call service.login with correct dto', async () => {
            const result = await controller.login(loginDto);

            expect(service.login).toHaveBeenCalledWith(loginDto);
            expect(result).toEqual(mockResponse);
        });
    });
});
