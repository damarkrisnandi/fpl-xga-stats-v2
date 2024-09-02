import AppElementSummary from '@/components/main/AppElementSummary'
const PlayerPage = (props: any) => {
    const { params, searchParams } = props;
    return (
        <main className="min-h-screen pt-24">
            <AppElementSummary elementId={params.slug}/> 
        </main>
    )
}

export default PlayerPage;