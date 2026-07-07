"use server";

import { getCities, getProvinces, type LocationOption } from "@/service/cities";

export async function getProvinceOptions(): Promise<LocationOption[]> {
  return getProvinces();
}

export async function getCityOptions(provinceId?: number): Promise<LocationOption[]> {
  return getCities(provinceId);
}
