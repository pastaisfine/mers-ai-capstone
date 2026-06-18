import { useState, type ReactNode } from 'react';
import { SimulatorContext } from './useSimulator';



export function SimulatorProvider({ children }: { children: ReactNode }) {

    const [isSimulating, setIsSimulating] = useState(false);
    const [simLogFeed, setSimLogFeed] = useState<string[]>([
        'System standby. Ready for instructions.'
    ]);

    return <SimulatorContext value={{ isSimulating, simLogFeed, setSimLogFeed, setIsSimulating }}>{children}</SimulatorContext>
}

