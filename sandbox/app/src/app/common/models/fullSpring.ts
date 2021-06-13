import { FlatSpring } from "./flatSpring";

export class FullSpring extends FlatSpring{
    name: string
    description: string
    info: string
    images: string[]
    filterCamping: boolean
    filterWater: boolean
    filterCar: boolean
    filterChildren: boolean
    filterDepth: boolean
    isFavorite: boolean
    preferredSeason: string
    comments: []
}