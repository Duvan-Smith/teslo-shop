import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        example: 'Shirt',
        description: 'Title',
        required: true
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example: 100,
        description: 'Price',
        required: false
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        example: 'test',
        description: 'Description',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 'test',
        description: 'Slug',
        required: false
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: 1,
        description: 'Stock',
        required: false
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        example: ['SM', 'M', 'L'],
        description: 'Sizes',
        required: true
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[]

    @ApiProperty({
        example: 'men',
        description: 'Gender',
        required: true
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        example: ['shirt'],
        description: 'Tags',
        required: true
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];
}