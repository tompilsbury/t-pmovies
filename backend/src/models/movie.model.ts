import { RowDataPacket } from "mysql2";

export default interface Movie extends RowDataPacket {
    id: number;
    title: string;
    language: string;
    overview: string;
    poster_path: string;
    rating: number;
    rating_count: number;
    release_date: Date;
    watched: boolean;
}   