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

export const getTrainer = cache(async (supabase: SupabaseClient) => {
  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (!authData || authError) 
    throw new Error('No autorizado')

  const { data, error } = await supabase
    .from('trainers')
    .select(`
      place,
      group,
      level,
      city!inner ( name, province ),
      user_id!inner ( user_id, name, surname )  
    `)
    .eq('user_id', authData.user.id)
    .single()
  
  if (error) {
    throw error
  }

  return {
    id: data.user_id.user_id,
    place: data.place,
    group: data.group,
    level: data.level,
    city: data.city.name,
    province: data.city.province,
    name: data.user_id.name,
    surname: data.user_id.surname
  }
})

type FiltersType = {
  query?: string,
  city?: string,
  prov?: string,
  place?: string,
  group?: string,
  level?: string
}

export const getTrainers = cache(async (supabase: SupabaseClient, filters: FiltersType) => {
  const query = supabase
    .from('trainers')
    .select(`
      place,
      group,
      level,
      city!inner ( name, province ),
      user_id!inner ( user_id, name, surname )
    `)

  if (filters.prov)
    query.eq('city.province', filters.prov)
    
  if (filters.city)
    query.eq('city.name', filters.city)

  if (filters.query)
    query.ilike('user_id.name', `%${filters.query}%`)

  const { data, error } = await query
  
  if (error) {
    throw error
  }

  // check if possible to add to supabase filters
  const trainers = data.filter((trainer: any) => {
    if (filters.place?.split(',').some(p => p === 'true')
      && !filters.place?.split(',').some((p, i) => (p === 'true') && trainer.place[i]))
        return false
    
    if (filters.group?.split(',').some(g => g === 'true')
      && !filters.group?.split(',').some((g, i) => (g === 'true') && trainer.group[i]))
        return false
    
    if (filters.level?.split(',').some(l => l === 'true')
      && !filters.level?.split(',').some((l, i) => (l === 'true') && trainer.level[i]))
        return false

    return true
  })

  return trainers.map((trainer: any) => ({
    id: trainer.user_id.user_id,
    place: trainer.place,
    group: trainer.group,
    level: trainer.level,
    city: trainer.city.name,
    province: trainer.city.province,
    name: trainer.user_id.name,
    surname: trainer.user_id.surname
  }))
})

export const getTrainerById = cache(async (supabase: SupabaseClient, id: string) => {
  const { data, error } = await supabase
    .from('trainers')
    .select(`
      place,
      group,
      level,
      city!inner ( name, province ),
      user_id!inner ( name, surname )  
    `)
    .eq('user_id', id)
    .single()
  
  if (error) {
    throw error
  }

  return {
    id: id,
    place: data.place,
    group: data.group,
    level: data.level,
    city: data.city.name,
    province: data.city.province,
    name: data.user_id.name,
    surname: data.user_id.surname
  }
})