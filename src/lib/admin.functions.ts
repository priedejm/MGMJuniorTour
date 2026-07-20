import { z } from "zod";
import { apiGet, apiPost } from "./api-client";

// ---------- Zod schemas ----------
const tournamentSchema = z.object({
  id: z.string().min(1).optional(),
  slug: z.string().min(1).max(120),
  dates_label: z.string().min(1).max(120),
  city: z.string().min(1).max(120),
  tee_time: z.string().min(1).max(60),
  course: z.string().min(1).max(200),
  month: z.string().min(1).max(40),
  year: z.number().int().min(2000).max(2100),
  tbd: z.boolean(),
  sort_order: z.number().int(),
});
export type TournamentRow = z.infer<typeof tournamentSchema>;

const packageSchema = z.object({
  id: z.string().min(1).optional(),
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  price: z.string().min(1).max(60),
  callout: z.string().max(120).default(""),
  image_url: z.string().max(2000).default(""),
  description: z.string().max(5000).default(""),
  features: z.array(z.string().max(500)).default([]),
  included: z
    .array(z.object({ label: z.string().max(500), note: z.string().max(500).optional() }))
    .default([]),
  bonuses: z.array(z.string().max(500)).default([]),
  total_value: z.string().max(200).default(""),
  disclaimer: z.string().max(2000).default(""),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});
export type PackageRow = z.infer<typeof packageSchema>;

const photoSchema = z.object({
  id: z.string().min(1).optional(),
  image_url: z.string().min(1).max(2000),
  caption: z.string().max(500).default(""),
  sort_order: z.number().int().default(0),
});
export type PhotoRow = z.infer<typeof photoSchema>;

const resultSchema = z.object({
  id: z.string().min(1).optional(),
  tournament_id: z.string().min(1).nullable().optional(),
  tournament_name: z.string().min(1).max(200),
  date: z.string().min(1).max(20),
  location: z.string().max(200).default(""),
  results_url: z.string().max(500).default(""),
  sort_order: z.number().int().default(0),
  images: z.array(z.string().max(2000)).default([]),
});
export type ResultRow = z.infer<typeof resultSchema>;

const idSchema = z.object({ id: z.string().min(1) });

// ================= TOURNAMENTS =================
export async function listTournaments(): Promise<TournamentRow[]> {
  return apiGet<TournamentRow[]>("/list-tournaments.php");
}

export async function upsertTournament(input: { data: z.input<typeof tournamentSchema> }) {
  const data = tournamentSchema.parse(input.data);
  return apiPost<{ ok: true; id: string }>("/save-tournament.php", data, true);
}

export async function deleteTournament(input: { data: { id: string } }) {
  const data = idSchema.parse(input.data);
  return apiPost<{ ok: true }>("/delete-tournament.php", data, true);
}

// ================= PACKAGES =================
export async function listPackages(): Promise<PackageRow[]> {
  return apiGet<PackageRow[]>("/list-packages.php");
}

export async function upsertPackage(input: { data: z.input<typeof packageSchema> }) {
  const data = packageSchema.parse(input.data);
  return apiPost<{ ok: true; id: string }>("/save-package.php", data, true);
}

export async function deletePackage(input: { data: { id: string } }) {
  const data = idSchema.parse(input.data);
  return apiPost<{ ok: true }>("/delete-package.php", data, true);
}

// ================= PHOTOS =================
export async function listPhotos(): Promise<PhotoRow[]> {
  return apiGet<PhotoRow[]>("/list-photos.php");
}

export async function upsertPhoto(input: { data: z.input<typeof photoSchema> }) {
  const data = photoSchema.parse(input.data);
  return apiPost<{ ok: true; id: string }>("/save-photo.php", data, true);
}

export async function deletePhoto(input: { data: { id: string } }) {
  const data = idSchema.parse(input.data);
  return apiPost<{ ok: true }>("/delete-photo.php", data, true);
}

// ================= RESULTS =================
export async function listResults(): Promise<ResultRow[]> {
  return apiGet<ResultRow[]>("/list-results.php");
}

export async function upsertResult(input: { data: z.input<typeof resultSchema> }) {
  const data = resultSchema.parse(input.data);
  return apiPost<{ ok: true; id: string }>("/save-result.php", data, true);
}

export async function deleteResult(input: { data: { id: string } }) {
  const data = idSchema.parse(input.data);
  return apiPost<{ ok: true }>("/delete-result.php", data, true);
}
