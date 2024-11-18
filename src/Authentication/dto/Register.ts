import { IsNotEmpty, IsString } from "class-validator";
import { LoginDto } from "./Login";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto extends LoginDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'test'
    })
    @IsNotEmpty()
    @IsString()
    name: string;
}       