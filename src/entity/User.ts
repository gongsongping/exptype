import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    // @Column()
    // age: number;
     
    // @PrimaryGeneratedColumn()
    // id: number;

    // @Column("varchar")
    // firstName: string;

    // @Column("varchar")
    // lastName: string;
}

