import { FlatHotel } from "./flatHotel"

export class FullHotel extends FlatHotel{
    attractions: string[];
    breakfast: boolean;
    breakfastPrice: number;
    region: string;
    location: { _latitude: number, _longitude: number};
    phone :string;
    pool: boolean;
    websiteLink: string;
    description: string;
}