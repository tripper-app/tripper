
export class unRegisteredUserError extends Error{
    status: number;
    constructor(err: string){
        super(err);
        this.name = "unRegisteredUserErrornnectionError";
        this.status = 401;
    }
}