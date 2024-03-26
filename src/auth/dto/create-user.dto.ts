import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
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
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        example: 'dsmith',
        description: 'Nombre',
        required: true
    })
    @IsString()
    @MinLength(1)
    fullName: string;
}