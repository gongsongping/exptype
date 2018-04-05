import "reflect-metadata";
import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from  "body-parser";
import {createConnection, getManager} from "typeorm";
// import cors from 'cors';
const cors = require('cors')
// import { User } from "./entity/User";
// import { Post } from "./entity/Post";
// import { Comment } from "./entity/Comment";
import {User, Post, Comment } from "./entity/models";

// create typeorm connection
createConnection({
    "type": "sqlite",
    "database": "./test.sql",
    "entities": [User,Post,Comment],
    // "synchronize": true,
    "logging": true
  }).then(connection => {
    const userRepository = connection.getRepository(User);
    const postRepository = connection.getRepository(Post);
    const mng = getManager();
    // create and setup express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors())
    // register routes
    
    app.get("/users", async function(req: Request, res: Response) {
        let u = new User()
        // u.firstName = 'firstn'
        u.lastName = 'lastn'

        let p = new Post()
        p.content = 'cnent'
        await mng.save(Post, p);
        u.posts = [p]
        await mng.save(User, u);
        console.log('savedd');
        // return userRepository.find();
        // let us = await  userRepository.find();
        let us = await  mng.createQueryBuilder(User, "user")
        // .select()
        .leftJoinAndSelect("user.posts","post", "post.user_id = user.id")
        // .from(User, "user")
        // .where("user.id = :id", { id: 1 })
        .getMany();
        // console.log(us);
        res.json(us)
    });
    
    app.get("/users/:id", async function(req: Request, res: Response) {
        return userRepository.findOneById(req.params.id);
    });
    
    app.post("/users", async function(req: Request, res: Response) {
        const user = userRepository.create(req.body);
        return userRepository.save(user);
    });
    
    app.delete("/users/:id", async function(req: Request, res: Response) {
        return userRepository.removeById(req.params.id);
    });

    app.get("/posts", async function(req: Request, res: Response) {
        // let ps = await  mng.find(Post);
        let ps = await  mng.createQueryBuilder(Post, "post")
        .select()
        // .leftJoinAndSelect("post.user","user", "post.user_id = user.id")
        // .from(User, "user")
        // .where("user.id = :id", { id: 1 })
        .orderBy("post.id", "DESC")
        .skip(req.query.skip*10)
        .take(10)
        .getMany();

        // console.log(ps);
        res.json(ps)
    });

    app.post("/posts", async function(req: Request, res: Response) {
        let p = new Post()
        p.content = req.body.content
        let last = await mng.createQueryBuilder(User, "user")
        .select()
        .orderBy("user.id", "DESC")
        .take(1)
        .getOne()
        let any = Math.floor(Math.random() * last.id) + 1
        let u = await mng.findOneById(User,any)
        console.log(any,'ddd',u);
        p.user = u
        await mng.save(p);
        console.log('savedd');
        res.json({ok:'ok'})
    });

    app.get("/posts/:id", async function(req: Request, res: Response) {
        let p = await  mng.createQueryBuilder(Post, "post")
        .select()
        .where("post.id = :id", { id: req.params.id })
        .getOne()
        let cmts = await  mng.createQueryBuilder(Comment, "comment")
        // // .leftJoinAndSelect("comment.user","user", "comment.user_id = user.id")
        // .from(User, "user")
        .where("comment.post_id = :id", { id: req.params.id })
        .orderBy("comment.id", "DESC")    
        // .skip()    
        .getMany();

        res.json({post:p, comments:cmts})
    });

    app.post("/comments", async function(req: Request, res: Response) {
        return userRepository.removeById(req.params.id);
    });
    
    // start express server
    app.listen(3002);
});