import AppInputMyTeam from '@/components/main/AppInputMyTeam'

const MyTeam = (props: any) => {
    const { params, searchParams } = props;
    return (
        <main className="flex min-h-screen flex-col items-center pt-24">
           <AppInputMyTeam /> 
        </main>
    )
}

export default MyTeam;