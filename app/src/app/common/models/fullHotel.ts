import { FlatHotel } from "./flatHotel"

export class FullHotel extends FlatHotel{
    attractions: string[];
    breakfast: boolean;
    city: string;
    image: string[];
    location: { _latitude: number, _longitude: number};
    phone :string;
    pool: boolean;
    websiteLink: string;
}