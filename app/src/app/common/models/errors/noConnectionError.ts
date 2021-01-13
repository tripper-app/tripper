import localize from 'nativescript-localize';

export class noConnectionError extends Error{
    status: number;
    constructor(){
        super(localize('messages.error.connectionError'));
        this.name = "noConnectionError";
        this.status = 0;
    }
}