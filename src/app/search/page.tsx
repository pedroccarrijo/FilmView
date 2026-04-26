'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import MovieCard from '@/src/components/MovieCard';
import { Movie } from '@/src/types/movie';
import '@/src/components/MovieListe/index.scss';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            getSearchedMovies(query);
        }
    }, [query]);

    const getSearchedMovies = (searchQuery: string) => {
        setLoading(true);
        axios({
            method: 'get',
            url: 'https://api.themoviedb.org/3/search/multi', 
            params: {
                api_key: '99dd1bc749f8d84486e3d5c276211ab5',
                language: 'pt-BR',
                query: searchQuery,
                include_adult: false
            }
        }).then(response => {
            const apenasFilmesESeries = response.data.results.filter(
                (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
            );
            
            setMovies(apenasFilmesESeries);
            setLoading(false);
        }).catch(error => {
            console.error("Erro na busca:", error);
            setLoading(false);
        });
    }

    return (
        <main className="search-container" style={{ padding: '2rem' }}>
            <h2 style={{ color: 'white', marginBottom: '2rem' }}>
                Resultados para: "{query}"
            </h2>

            {loading ? (
                <p style={{ color: 'white' }}>Carregando...</p>
            ) : (
                <ul className="movie-list">
                    {movies.length > 0 ? (
                        movies.map((movie) => 
                            <MovieCard
                                key={movie.id} 
                                movie={movie}
                            />
                        )
                    ) : (
                        <p style={{ color: 'white' }}>Nenhum filme encontrado.</p>
                    )}
                </ul>
            )}
        </main>
    );
}