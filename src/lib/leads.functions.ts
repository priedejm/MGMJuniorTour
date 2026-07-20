import { z } from "zod";
import { apiGet, apiPost } from "./api-client";

const leadSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  state: z.string().trim().max(60).default(""),
  junior_ages: z.string().trim().max(200).default(""),
  source: z.string().trim().max(60).default(""),
});

export type Lead = {
  id: string;
  full_name: string;
  email: string;
  state: string;
  junior_ages: string;
  source: string;
  created_at: string;
};

// Public — anyone can submit a lead from the /join page. No admin header
// required; the endpoint only accepts inserts, never reads or deletes.
export async function submitLead(input: { data: z.input<typeof leadSchema> }) {
  const data = leadSchema.parse(input.data);
  return apiPost<{ ok: true }>("/submit-lead.php", data);
}

export async function listLeads(): Promise<Lead[]> {
  return apiGet<Lead[]>("/list-leads.php", true);
}

export async function deleteLead(input: { data: { id: string } }) {
  return apiPost<{ ok: true }>("/delete-lead.php", input.data, true);
}
