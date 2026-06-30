import { ArchivedReport, ReportFilterType } from "@/models/report";
import { createContext, useContext } from "react";

interface Context {
  reports: ArchivedReport[];
  showReportId: string | null;
  setShowReportId: (v: string | null) => void;
  showReport: ArchivedReport | null;
  filteredReports: ArchivedReport[];
  selectedFilter: ReportFilterType;
  setFilterType: (v: ReportFilterType) => void;
  searchPattern: string;
  setSearchPattern: (v: string) => void;
}

export const ReportContext = createContext<null | Context>(null);

export function useReport() {
  const reportContext = useContext(ReportContext);
  if (reportContext == null) throw new Error("Null context");
  return reportContext;
}
