import { LanguageService } from "../../services/language-service";

export class noConnectionError extends Error{
    status: number;
    constructor(err: string){
        super(err);
        this.name = "noConnectionError";
        this.status = 0;
    }
}