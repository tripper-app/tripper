import localize from 'nativescript-localize';

export class unRegisteredUserError extends Error{
    status: number;
    constructor(){
        super(localize('messages.error.unRegisteredUser'));
        this.name = "unRegisteredUserErrornnectionError";
        this.status = 401;
    }
}