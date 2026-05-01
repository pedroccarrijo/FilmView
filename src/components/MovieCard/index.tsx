'use client'

import Link from 'next/link';
import { Movie } from "@/src/types/movie";
import Stars from "../Stars";
import './index.scss'

export interface Props {
    movie: Movie;
    type?: 'movie' | 'tv'; 
}

export default function MovieCard(props: Props){
    const movie = props.movie;
    
    //  Define se é filme ou série. 
    const mediaType = props.type || (movie as any).media_type || 'movie';
    
    return (
        <li className='movie-card'>
            
            <div className="movie-poster">
                <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem'}
                    alt={movie.title || movie.name}
                />
            </div>

            <div className="movie-infos">
                <p className="movie-title">
                    {movie.title || movie.name} 
                </p>
                
                <Stars rating={movie.vote_average} />
                
                <div className="hidden-content">
                    {movie.overview &&
                        <p className='description'>
                            {movie.overview.length > 100
                                ?`${movie.overview.substring(0,100)}...`
                                : movie.overview
                            }
                        </p>
                    }

                    <Link className="btn-default" href={`/movie/${movie.id}?type=${mediaType}`}>
                        Ver mais
                    </Link>
                </div>
            </div>
        </li>
    )
}