import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getCities = cache(async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from('cities')
    .select('name, province')
  
  if (error) {
    throw error
  }

  return data
})