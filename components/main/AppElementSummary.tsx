'use client'
import { useEffect, useState } from 'react'
export const AppElementSummary = (props: any) => {
    const { elementId } = props;

    const [bootstrap, setBootstrap] = useState<any>(null);
    const [elementSummary, setElementSummary] = useState<any>(null);

    useEffect(() => {
        if (!bootstrap) {
        }
    })

    return (
        <div className="flex flex-col items-center">player/{elementId}</div>
    )
}

export default AppElementSummary;