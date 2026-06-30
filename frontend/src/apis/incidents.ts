import { IncidentDto, IncidentDtoSchema } from "@/dtos/incidents";
import axios from "axios";
import { removeUndefinedFields } from "../lib/utils";

async function readIncidents(payload: {
  page: number;
  size: number;
  pattern?: string;
}): Promise<IncidentDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/incidents/`;
  const response = await axios.get(url, {
    params: removeUndefinedFields(payload),
  });
  return response.data.map((res: unknown) => IncidentDtoSchema.parse(res));
}

export const IncidentApi = {
  readIncidents,
};
