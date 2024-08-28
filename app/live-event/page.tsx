import AppLiveEvent from "@/components/main/AppLiveEvent"

export default function Home(props: any) {
    console.log(props)
    return (
        <main className="flex min-h-screen flex-col items-center pt-24">
           <AppLiveEvent /> 
        </main>
    )

}