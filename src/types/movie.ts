export interface Movie {
    id: number;
    title?: string;  //Filmes 
    name?: string;   //Séries 
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
}