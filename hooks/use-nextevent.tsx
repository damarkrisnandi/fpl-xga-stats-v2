'use client'

import { useEffect, useState } from "react";

const useNextEvent = ({ bootstrap }: any) => {
  const [nextEvent, setNextEvent] = useState<any>(null);
 

  useEffect(() => {
    const allNextEvents = bootstrap.events.filter(
      (event: any) =>
        new Date(event.deadline_time).getTime() > new Date().getTime(),
    );

    
    if (!nextEvent) {
      setNextEvent(allNextEvents.length > 0 ? allNextEvents[0] : 39);
    }
  }, [bootstrap]);  

  return { nextEvent }
}

export default useNextEvent;
