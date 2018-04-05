// import "reflect-metadata";
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn} from "typeorm";
// import { User } from './User'
// import { Comment } from './Comment'


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 150,
        nullable: true,
        // unique: true,
    })
    firstName: string;

    @Column()
    lastName: string;

    @Column({nullable: true,})
    age: number;

    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt: Date;

    @OneToMany(type => Post, post => post.user)
    posts: Post[];

}

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: true,
    })
    title: string;

    @Column({
        type: "varchar",
        length: 150,
    })
    content: string;

    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt: Date;

    @ManyToOne(type => User, user => user.posts, { cascadeAll: true, })
    @JoinColumn({ name: "user_id", })
    user: User;

    @OneToMany(type => Comment, comment => comment.post)
    comments: Comment[];

}

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: true,
    })
    content: string;

    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt: Date;
    
    @ManyToOne(type => Post, post => post.comments, { cascadeAll: true, })
    @JoinColumn({ name: "post_id" })     
    post: Post;
}