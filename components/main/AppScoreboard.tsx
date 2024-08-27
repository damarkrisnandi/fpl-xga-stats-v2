const AppScoreBoard = (props: any) => {
    return (
        <div className={`bg-slate-600 w-8 h-8 flex justify-center items-center rounded ${props.className ? props.className : ''}`}>
            <div className="flex justify-center items-center flex-col">
                <p className="text-lg font-semibold text-white">{props.score}</p>
            </div>
            
        </div>
      
    )
}

export default AppScoreBoard;