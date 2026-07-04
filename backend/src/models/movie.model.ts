import { RowDataPacket } from "mysql2";

export default interface Movie extends RowDataPacket {
    movieID: number;
    title: string;
    image: string;
    watched: boolean;
}   