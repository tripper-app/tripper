import { FlatSpring } from "./flatSpring";

export class FullSpring extends FlatSpring {
    // Stamped by SpringsService.getSpring() (the id used to open/cache the spring).
    ID: string = "";
    name: string = "";
    description: string = "";
    info: string = "";
    images: string[] = [];
    filterCamping: boolean = false;
    filterWater: boolean = false;
    filterCar: boolean = false;
    filterChildren: boolean = false;
    filterDepth: boolean = false;
    isFavorite: boolean = false;
    preferredSeason: string = "";
    depth: string = "";
    distanceFromCar: string = "";
    comments: any[] = [];
}
