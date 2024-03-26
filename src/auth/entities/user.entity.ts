import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column('text', {
        unique: true
    })
    email: string;

    @ApiProperty()
    @Column('text')
    password: string;

    @ApiProperty()
    @Column('text')
    fullName: string;

    @ApiProperty()
    @Column('bool')
    isActive: boolean;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];
}