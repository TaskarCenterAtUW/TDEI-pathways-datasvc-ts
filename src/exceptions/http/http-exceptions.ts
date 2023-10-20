import HttpException from "./http-base-exception";

export class DuplicateException extends HttpException {
    constructor(name: string) {
        super(400, `Input with value '${name}' already exists.`);
    }
}

export class OverlapException extends HttpException {
    constructor(name:string){
        super(400,`Given record overlaps with tdeirecord ${name} in the system`);
    }
}

export class StationNotFoundException extends HttpException {
    constructor(stationId:string){
        super(404,`Station with ID ${stationId} not found or inactive for the org.`)
    }
}


export class UnAuthenticated extends HttpException {
    constructor() {
        super(401, `User not authenticated/authorized to perform this action.`);
    }
}

export class ForeignKeyException extends HttpException {
    constructor(name: string) {
        super(400, `No reference found for the constraint '${name}' in the system.`);
    }
}

export class FileTypeException extends HttpException{
    constructor(){
        super(400,'Invalid file type.');
    }
}

export class UserNotFoundException extends HttpException {
    constructor(name: string) {
        super(404, `User not found for the given username '${name}'.`);
    }
}

export class InputException extends HttpException {
    constructor(message: string) {
        super(400, message);
    }
}



