import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from "src/auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        example: 'uidd',
        description: 'Id',
        required: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Shirt',
        description: 'Title',
        required: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 100,
        description: 'Price',
        required: false
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'test',
        description: 'Description',
        required: false
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description?: string;

    @ApiProperty({
        example: 'test',
        description: 'Slug',
        required: false
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 1,
        description: 'Stock',
        required: false
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['test'],
        description: 'Sizes',
        required: true
    })
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: 'men',
        description: 'Gender',
        required: true
    })
    @Column('text')
    gender: string;

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}