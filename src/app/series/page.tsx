import ExploreList from '@/src/components/ExplorerList';

export default function SeriesPage() {
    return (
        <main style={{ padding: '2rem' }}>
            <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center' }}>Explorar Séries</h2>
            <ExploreList type="tv" />
        </main>
    );
}