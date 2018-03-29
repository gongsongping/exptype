import "reflect-metadata";
import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from  "body-parser";
import {createConnection} from "typeorm";
import {User} from "./entity/User";

// create typeorm connection
createConnection({
    "type": "sqlite",
    "database": "./test.sql",
    "entities": [User],
    "synchronize": true,
    "logging": true
  }).then(connection => {
    const userRepository = connection.getRepository(User);
    
    // create and setup express app
    const app = express();
    app.use(bodyParser.json());
    
    // register routes
    
    app.get("/users", async function(req: Request, res: Response) {
        let u = new User()
        u.firstName = 'firstn'
        u.lastName = 'lastn'
        // const user = userRepository.create(req.body);
        await userRepository.save(u);
        console.log('saved');
        // return userRepository.find();
        let us = await  userRepository.find();
        console.log(us);
        res.json({l:us})
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
    
    // start express server
    app.listen(5000);
});