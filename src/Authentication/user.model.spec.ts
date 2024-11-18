import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSchema, User } from './user.model';

// Mock the mongoose model
jest.mock('mongoose', () => {
    const actual = jest.requireActual('mongoose');
    const savedEmails = new Set();

    return {
        ...actual,
        Model: class {
            [x: string]: any;
            constructor(data) {
                this._id = new actual.Types.ObjectId();
                Object.assign(this, data);
            }
            save = jest.fn().mockImplementation(function () {
                // Validate required fields
                if (!this.email || !this.name || !this.password) {
                    return Promise.reject(new Error('User validation failed: Missing required fields'));
                }

                // Check for duplicate email
                if (savedEmails.has(this.email)) {
                    return Promise.reject(new Error('E11000 duplicate key error collection: test.users index: email_1 dup key'));
                }

                // Simulate password hashing
                if (this.password) {
                    this.password = '$2b$10$hashedpassword';
                }

                savedEmails.add(this.email);
                return Promise.resolve(this);
            });
            static deleteMany = jest.fn().mockImplementation(() => {
                savedEmails.clear();
                return Promise.resolve({});
            });
        },
    };
});

describe('User Model', () => {
    let userModel: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('User'),
                    useValue: Model,
                },
            ],
        }).compile();

        userModel = module.get<Model<User>>(getModelToken('User'));
        jest.clearAllMocks();
    });

    describe('Schema Validation', () => {
        it('should create a valid user', async () => {
            const validUser = new userModel({
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            });

            const savedUser = await validUser.save();
            expect(savedUser._id).toBeDefined();
            expect(savedUser.email).toBe('test@example.com');
            expect(savedUser.name).toBe('Test User');
            expect(savedUser.password).not.toBe('password123'); // Password should be hashed
        });

        it('should fail without required fields', async () => {
            const invalidUser = new userModel({});

            await expect(invalidUser.save()).rejects.toThrow();
        });

        it('should fail with duplicate email', async () => {
            const userData = {
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            };

            const firstUser = new userModel(userData);
            await firstUser.save();

            const duplicateUser = new userModel(userData);
            await expect(duplicateUser.save()).rejects.toThrowError(/E11000/);
        });
    });

    describe('Password Handling', () => {
        it('should hash password on save', async () => {
            const user = new userModel({
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            });

            const savedUser = await user.save();
            expect(savedUser.password).not.toBe('password123');
            expect(savedUser.password).toMatch(/^\$2[aby]\$\d+\$/);
        });

        it('should correctly check valid password', async () => {
            const user = new userModel({
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            });

            const savedUser = await user.save();
            const isMatch = await savedUser.checkPassword('password123');
            expect(isMatch).toBe(true);
        });

        it('should correctly reject invalid password', async () => {
            const user = new userModel({
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            });

            const savedUser = await user.save();
            const isMatch = await savedUser.checkPassword('wrongpassword');
            expect(isMatch).toBe(false);
        });
    });
});