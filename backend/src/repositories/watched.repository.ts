import { ResultSetHeader, QueryError } from "mysql2";
import connection from "../db/index";
import WatchedMovie from "../models/watched.model";

interface IWatchedRepository {
    save(movieId: number, 
        rating: number | null, 
        notes: string | null
    ): Promise<WatchedMovie>;
    retrieveAll(): Promise<WatchedMovie[]>;
    retrieveById(movieId: number): Promise<WatchedMovie | null>;
    update(movie: WatchedMovie): Promise<number>;
    delete(movieId: number): Promise<number>;
}

class WatchedRepository implements IWatchedRepository { 
    save(movieId: number, 
        rating: number | null, 
        notes: string | null
    ): Promise<WatchedMovie> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                "INSERT INTO watched_movies (id, rating, notes) VALUES (?,?,?)",
                [movieId, rating, notes],
                (err: QueryError | null, res: ResultSetHeader) => {
                    if (err) reject(err);
                    else
                        this.retrieveById(res.insertId)
                            .then((movie) => resolve(movie!))
                            .catch(reject);
                }
            );
        });
    }

    retrieveAll(): Promise<WatchedMovie[]> {
        let query: string = "SELECT * from watched_movies";

        return new Promise((resolve, reject) => {
            connection.query<WatchedMovie[]>(query, (err: QueryError | null, res: WatchedMovie[]) => {
                if (err) reject(err)
                else resolve(res);
            });
        });
    }

    retrieveById(movieId: number): Promise<WatchedMovie | null> {
        return new Promise((resolve, reject) => {
            connection.query<WatchedMovie[]>(
            "SELECT * FROM movies WHERE movieId = ?",
            [movieId],
            (err: QueryError | null, res: WatchedMovie[]) => {
                if (err) reject(err);
                else resolve(res?.[0] ?? null);
            }
            );
        });
    }

    update(movie: WatchedMovie): Promise<number> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
            "UPDATE movies SET rating = ?, notes = ? WHERE id = ?",
            [movie.rating, movie.notes, movie.movieId],
            (err: QueryError | null, res: ResultSetHeader) => {
                if (err) reject(err);
                else resolve(res.affectedRows);
            }
            );
        });
    }

    delete(movieId: number): Promise<number> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
            "DELETE FROM watched_movies WHERE id = ?",
            [movieId],
            (err: QueryError | null, res: ResultSetHeader) => {
                if (err) reject(err);
                else resolve(res.affectedRows);
            }
            );
        });
    }
}

export default new WatchedRepository();