import { validate } from 'class-validator';
import { LoginDto } from './Login';

describe('LoginDto', () => {
    let dto: LoginDto;

    beforeEach(() => {
        dto = new LoginDto();
    });

    it('should pass validation with valid email and password', async () => {
        dto.email = 'test@example.com';
        dto.password = 'Password1@';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    describe('email validation', () => {
        it('should fail with invalid email format', async () => {
            dto.email = 'invalid-email';
            dto.password = 'Password1@';

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isEmail');
        });

        it('should fail with empty email', async () => {
            dto.email = '';
            dto.password = 'Password1@';

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });
    });

    describe('password validation', () => {
        it('should fail with password shorter than 8 characters', async () => {
            dto.email = 'test@example.com';
            dto.password = 'Pass1@';

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('minLength');
        });

        it('should fail without a letter', async () => {
            dto.email = 'test@example.com';
            dto.password = '12345678@';

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints?.matches).toContain('Password must contain at least 1 letter');
        });

        it('should fail without a number', async () => {
            dto.email = 'test@example.com';
            dto.password = 'Password@';

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints?.matches).toContain('Password must contain at least 1 number');
        });

        it('should fail without a special character', async () => {
            dto.email = 'test@example.com';
            dto.password = 'Password1';

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints?.matches).toContain('Password must contain at least 1 special character');
        });
    });
});