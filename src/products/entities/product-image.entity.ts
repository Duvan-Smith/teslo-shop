import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

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
    @Column('text')
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images
    )
    product: Product
}