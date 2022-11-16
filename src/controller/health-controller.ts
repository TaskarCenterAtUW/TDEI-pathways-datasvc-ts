import express, { Request } from "express";
import { IController } from "./interface/IController";

class HealthController implements IController {
    public path = '/health';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(`${this.path}/ping`, this.getping);
    }

    getping = async (request: Request, response: express.Response) => {

        // return loaded posts
        response.send("I'm healthy !");
    }
}

export default HealthController;