import { FlatHotel } from "./flatHotel"

export class FullHotel extends FlatHotel{
    attractions: string[];
    breakfast: boolean;
    region: string;
    location: { _latitude: number, _longitude: number};
    phone :string;
    pool: boolean;
    websiteLink: string;
    description: string;
}