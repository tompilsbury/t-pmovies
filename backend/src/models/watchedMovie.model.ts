import { RowDataPacket } from "mysql2";

export default interface WatchedMovie extends RowDataPacket {
    movieId: number;
    rating: number | null;
    notes: string | null;
}   