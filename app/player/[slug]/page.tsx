import AppElementSummary from '@/components/main/AppElementSummary'
const PlayerPage = (props: any) => {
    const { params, searchParams } = props;
    return (
        <main className="flex min-h-screen flex-col items-center pt-24">
            <AppElementSummary elementId={params.slug}/> 
        </main>
    )
}

export default PlayerPage;