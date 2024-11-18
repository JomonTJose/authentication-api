import { validate } from 'class-validator';
import { CreateUserDto } from './Register';

describe('RegisterDto', () => {
    let dto: CreateUserDto;

    beforeEach(() => {
        dto = new CreateUserDto();
    });

    it('should pass validation with all valid fields', async () => {
        dto.email = 'test@example.com';
        dto.password = 'Password1@';
        dto.name = 'John Doe';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    describe('name validation', () => {
        it('should fail with empty name', async () => {
            dto.email = 'test@example.com';
            dto.password = 'Password1@';
            dto.name = '';

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });

        it('should fail with non-string name', async () => {
            dto.email = 'test@example.com';
            dto.password = 'Password1@';
            dto.name = 123 as unknown as string;

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isString');
        });
    });

    describe('inherited validations', () => {
        it('should fail with invalid email', async () => {
            dto.email = 'invalid-email';
            dto.password = 'Password1@';
            dto.name = 'John Doe';

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
        });

        it('should fail with invalid password', async () => {
            dto.email = 'test@example.com';
            dto.password = '123'; // Too short
            dto.name = 'John Doe';

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
        });
    });
});