import { Unique, BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Unique(['username', 'password'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
}