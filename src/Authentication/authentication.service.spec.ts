import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userModel: Model<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser = {
    _id: 'someId',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    checkPassword: jest.fn(),
    save: jest.fn().mockResolvedValue(undefined),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    new: jest.fn().mockResolvedValue(mockUser),
  };

  mockUserModel.create.mockImplementation((dto) => {
    return {
      ...mockUser,
      ...dto,
      save: jest.fn().mockResolvedValue({ ...mockUser, ...dto }),
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    userModel = module.get<Model<User>>(getModelToken('User'));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const createUserDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

      const result = await service.register(createUserDto);

      expect(result).toHaveProperty('token');
      expect(result.message).toBe('User registered successfully');
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser as any);

      await expect(service.register(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      mockUser.checkPassword.mockResolvedValueOnce(true);
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser as any);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result.message).toBe('User logged in successfully');
    });

    it('should throw BadRequestException if user not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

      await expect(service.login(loginDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockUser.checkPassword.mockResolvedValueOnce(false);
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser as any);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return user if found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser as any);

      const result = await service.findOneByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

      const result = await service.findOneByEmail('test@example.com');
      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser, mockUser];
      jest.spyOn(userModel, 'find').mockResolvedValueOnce(mockUsers as any);

      const result = await service.getAllUsers();
      expect(result).toEqual(mockUsers);
    });
  });
});
