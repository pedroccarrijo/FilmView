'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import MovieCard from '../MovieCard'
import { Movie } from '@/src/types/movie'
import './index.scss'

interface ExploreListProps {
    type: 'movie' | 'tv';
}

export default function ExploreList({ type }: ExploreListProps) {
    const [items, setItems] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<{id: number, name: string}[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/genre/${type}/list`, {
            params: { api_key: API_KEY, language: 'pt-BR' }
        }).then(res => setGenres(res.data.genres));
        
        setSelectedGenre(null);
        setCurrentPage(1);
    }, [type]);

    useEffect(() => {
        const fetchItems = async () => {
            const response = await axios.get(`https://api.themoviedb.org/3/discover/${type}`, {
                params: {
                    api_key: API_KEY,
                    language: 'pt-BR',
                    with_genres: selectedGenre,
                    page: currentPage,
                    sort_by: 'popularity.desc'
                }
            });
            setItems(response.data.results);
            setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages);
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        fetchItems();
    }, [type, selectedGenre, currentPage]);

    const renderPagination = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button 
                    key={i} 
                    className={currentPage === i ? 'active' : ''}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const currentGenreName = selectedGenre 
        ? genres.find(g => g.id === selectedGenre)?.name 
        : (type === 'movie' ? 'Todos os Filmes' : 'Todas as Séries');

    return (
        <div className="explore-container">
            <div className="genre-filter">
                <button 
                    className={selectedGenre === null ? 'active' : ''} 
                    onClick={() => { setSelectedGenre(null); setCurrentPage(1); }}
                >
                    Todos
                </button>
                {genres.map(g => (
                    <button 
                        key={g.id} 
                        className={selectedGenre === g.id ? 'active' : ''}
                        onClick={() => { setSelectedGenre(g.id); setCurrentPage(1); }}
                    >
                        {g.name}
                    </button>
                ))}
            </div>

            <h3 className="section-title">{currentGenreName}</h3>

            <ul className="compact-grid">
                {items.map((item) => (
                    <MovieCard key={item.id} movie={item} type={type} />
                ))}
            </ul>

            <div className="numeric-pagination">
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(p => p - 1)}
                >
                    «
                </button>
                
                {renderPagination()}

                <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(p => p + 1)}
                >
                    »
                </button>
            </div>
        </div>
    );
}