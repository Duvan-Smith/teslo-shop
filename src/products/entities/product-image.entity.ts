import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductImage {
    @ApiProperty({
        example: 1,
        description: 'Id',
        required: true
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'https',
        description: 'url',
        required: true
    })
    @Column('text', {
        unique: true
    })
    url: string;
}