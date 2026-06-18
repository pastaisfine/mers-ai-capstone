import { Incident } from "@/types";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface Context {
  incidents: Incident[];
  activeIncident: Incident;
  selectedIncidentId: string;
  setIncidents: Dispatch<SetStateAction<Incident[]>>;
  setSelectedIncidentId: Dispatch<SetStateAction<string>>;
}

export const IncidentContext = createContext<null | Context>(null);

export function useIncident() {
  const incidentContext = useContext(IncidentContext);
  if (incidentContext == null) throw new Error("Null context");
  return incidentContext;
}
