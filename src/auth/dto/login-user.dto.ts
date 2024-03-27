import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        example: 'dsmith.mr@gmail.com',
        description: 'Correo',
        required: true
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Dsmith.mr@gmail.com',
        description: 'Contraseña',
        required: true
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;
}