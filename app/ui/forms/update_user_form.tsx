'use client'

import { useFormState } from "react-dom";
import { redirect } from "next/navigation";
import { updateUser } from "@/app/lib/actions";
import Filters from "../entrenadores/filters";
import LocationFilter from "../entrenadores/location_filter";
import Button from "../form/button";
import Message from "../form/message";

export default function UpdateUserForm({ cities, defaultOptions }: {
  cities: { name: string, province: string }[],
  defaultOptions: { 
    prov: string, 
    city: string,
    place: boolean[],
    group: boolean[],
    level: boolean[],
  },
}) {
  const [response, dispatch] = useFormState(updateUser, undefined)

  if (response?.status === 200) 
    redirect('/cuenta')

  return (
    <>
      <form action={dispatch} className='w-1/3 space-y-2'>
        <p>Completá tu información para registrarte como entrenador.</p>
        <LocationFilter
          cities={cities}
          defaultOptions={{ prov: defaultOptions.prov, city: defaultOptions.city }}
        />
        <Filters defaultFilters={{
          place: defaultOptions.place,
          group: defaultOptions.group,
          level: defaultOptions.level
        }} />
        <Button text='Publicar información' />
        <Message
          type={response?.status === 200 ? 'success' : 'error'}
          msg={response?.msg}
        />
      </form>
    </>
  )
}