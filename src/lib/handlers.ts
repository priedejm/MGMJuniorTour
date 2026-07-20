// Form submission handlers.
import { submitLead } from "./leads.functions";

export type JoinSubmission = {
  full_name: string;
  email: string;
  state: string;
  junior_ages: string;
  source?: string;
};

export type ContactSubmission = {
  name: string;
  phone: string;
  subject: string;
  message: string;
};

export type ArchiveUploadSubmission = {
  tournament_name: string;
  date: string;
  location: string;
  files: File[];
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function handleJoinSubmit(data: JoinSubmission) {
  return await submitLead({
    data: {
      full_name: data.full_name,
      email: data.email,
      state: data.state,
      junior_ages: data.junior_ages,
      source: data.source ?? "",
    },
  });
}

export async function handleContactSubmit(data: ContactSubmission) {
  console.log("[handleContactSubmit]", data);
  await wait(400);
  return { ok: true };
}

export async function handleArchiveUpload(data: ArchiveUploadSubmission) {
  console.log("[handleArchiveUpload]", {
    ...data,
    files: data.files.map((f) => ({ name: f.name, size: f.size })),
  });
  await wait(400);
  return { ok: true };
}

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];