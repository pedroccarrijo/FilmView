'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import MovieCard from '@/src/components/MovieCard';
import { Movie } from '@/src/types/movie';
import '@/src/components/ExplorerList/index.scss';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para controlar a paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Se o usuário digitar uma nova busca reseta a página
    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    // Busca os dados sempre que a busca (query) ou a página mudarem
    useEffect(() => {
        if (query) {
            getSearchedMovies(query, currentPage);
        }
    }, [query, currentPage]);

    const getSearchedMovies = (searchQuery: string, page: number) => {
        setLoading(true);
        axios({
            method: 'get',
            url: 'https://api.themoviedb.org/3/search/multi',
            params: {
                api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
                language: 'pt-BR',
                query: searchQuery,
                include_adult: false,
                page: page // Envia o número da página para a API do TMDB
            }
        }).then(response => {
            const apenasFilmesESeries = response.data.results.filter(
                (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
            );
            
            setMovies(apenasFilmesESeries);
            setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages);
            setLoading(false);
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }).catch(error => {
            console.error("Erro na busca:", error);
            setLoading(false);
        });
    }
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

    return (
        <main className="explore-container" style={{ padding: '2rem' }}>
            <h2 className="section-title" style={{ color: 'white', marginBottom: '2rem' }}>
                Resultados para: "{query}"
            </h2>

            {loading ? (
                <p style={{ color: 'white', textAlign: 'center' }}>Carregando...</p>
            ) : (
                <>
                    <ul className="compact-grid">
                        {movies.length > 0 ? (
                            movies.map((movie) => 
                                <MovieCard
                                    key={movie.id} 
                                    movie={movie}
                                />
                            )
                        ) : (
                            <p style={{ color: 'white', gridColumn: '1 / -1', textAlign: 'center' }}>
                                Nenhum filme ou série encontrado.
                            </p>
                        )}
                    </ul>

                    {/* Exibe a paginação apenas se houver mais de uma página */}
                    {movies.length > 0 && totalPages > 1 && (
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
                    )}
                </>
            )}
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<p style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Carregando...</p>}>
            <SearchContent />
        </Suspense>
    );
}