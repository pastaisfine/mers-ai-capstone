import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface Context {
    isSimulating: boolean;
    setIsSimulating: Dispatch<SetStateAction<boolean>>;
    simLogFeed: string[];
    setSimLogFeed: Dispatch<SetStateAction<string[]>>
}

export const SimulatorContext = createContext<null | Context>(null);

export function useSimulator() {
    const simulatorContext = useContext(SimulatorContext);
    if (simulatorContext == null) throw new Error("Null context");
    return simulatorContext;
}
