import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        example: 'admin1@admin.com',
        description: 'Correo',
        required: true
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Admin123',
        description: 'Contraseña',
        required: true
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;
}