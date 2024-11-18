import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class LoginDto {
    @ApiProperty({
        description: 'The email of the user',
        example: 'test@test.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'test123!'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*[a-zA-Z]))/, {
        message: 'Password must contain at least 1 letter'
    })
    @Matches(/((?=.*\d))/, {
        message: 'Password must contain at least 1 number'
    })
    @Matches(/((?=.*[@$!%*?&]))/, {
        message: 'Password must contain at least 1 special character'
    })
    password: string;
}   