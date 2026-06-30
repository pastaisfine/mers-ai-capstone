import { SeverityType } from "@/types";

export function getSeverityLabel(severity: SeverityType | string): string {
  return severity.toString().toUpperCase();
}

export function getSeverityBadgeClass(severity: SeverityType | string): string {
  const normalized = severity.toString().toLowerCase();
  switch (normalized) {
    case SeverityType.CRITICAL:
    case "critical":
      return "bg-destructive text-destructive-foreground";
    case SeverityType.URGENT:
    case "urgent":
      return "bg-warning text-warning-foreground";
    case SeverityType.MODERATE:
    case "moderate":
      return "bg-primary text-primary-foreground";
    case SeverityType.RESOLVED:
    case "resolved":
      return "bg-secondary text-secondary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getPanicBadgeClass(panicLevel: string): string {
  const level = panicLevel?.toLowerCase();
  if (level?.includes("extreme"))
    return "bg-destructive text-destructive-foreground";
  if (level?.includes("high")) return "bg-warning text-warning-foreground";
  if (level?.includes("moderate")) return "bg-primary text-primary-foreground";
  return "bg-secondary text-secondary-foreground";
}
