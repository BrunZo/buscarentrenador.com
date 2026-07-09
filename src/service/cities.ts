import { asc, eq } from "drizzle-orm";
import { db } from "@/db/index";
import { cities, provinces } from "@/db/schema";

export type LocationOption = { id: number; name: string };

export async function getProvinces(): Promise<LocationOption[]> {
  return db
    .select({ id: provinces.id, name: provinces.name })
    .from(provinces)
    .orderBy(asc(provinces.name));
}

export async function getCities(provinceId?: number): Promise<LocationOption[]> {
  let query = db
    .select({ id: cities.id, name: cities.name })
    .from(cities)
    .orderBy(asc(cities.name))
    .$dynamic();

  if (provinceId) query = query.where(eq(cities.province_id, provinceId));

  return query;
}
