'use client'

import { useEffect, useState } from 'react'
import './index.scss'
import axios from 'axios';
import MovieCard from '../MovieCard';
import { Movie } from '@/src/types/movie';

interface MovieListeProps {
    type: 'movie' | 'tv';
}

export default function MovieListe({ type }: MovieListeProps) {
    const [movies, setMovies] = useState<Movie[]>([]);

    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    useEffect(() => {
        getMovies();
    }, [type]);

    const getMovies = () => {
        axios({
            method: 'get',
            url: `https://api.themoviedb.org/3/discover/${type}`, 
            params: {
                api_key: API_KEY,
                language: 'pt-BR',
                sort_by: 'popularity.desc'
            }
        }).then(response => {
            setMovies(response.data.results);
        }).catch(error => {
            console.error("Erro ao buscar dados:", error);
        });
    }

    return (
        <>
            <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center' }}>Últimos Lançamentos</h2>
            <ul className="movie-list">
                {movies.map((movie) => 
                    <MovieCard
                        key={movie.id} 
                        movie={movie}
                    />
                )}
            </ul>
        </>
    )
}

/*
Resultado dos dados da API - filme de exemplo
adult: false
backdrop_path: "/kxQiIJ4gVcD3K6o14MJ72p5yRcE.jpg"
genre_ids: (5) [10751, 35, 12, 14, 16]
id: 1226863
original_language: "en"
original_title: "The Super Mario Galaxy Movie"
overview: "Depois de salvar o Reino dos Cogumelos, Mario e seus amigos se encontram em uma missão intergaláctica para deter um novo vilão ameaçador."
popularity: 743.5165
poster_path: "/b3WeTp42eJSRuE4UZfyPCOJW4c.jpg"
release_date: "2026-04-01"
title: "Super Mario Galaxy: O Filme"
video: false
vote_average: 6.756
vote_count: 537
*/