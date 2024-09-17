'use client'

import { useFormState } from "react-dom";
import Filters from "../entrenadores/filters";
import LocationFilter from "../entrenadores/location_filter";
import Button from "../form/button";
import Message from "../form/error";
import { updateUser } from "@/app/lib/actions";

export default function UpdateUserForm({ cities, defaultOptions }: {
  cities: { name: string, province: string }[],
  defaultOptions: { prov: string, city: string },
}) {
  const [response, dispatch] = useFormState(updateUser, undefined)

  return (
    <>
      <form action={dispatch} className='w-1/3 space-y-2'>
        <p>Completá tu información para registrarte como entrenador.</p>
        <LocationFilter
          cities={cities}
          defaultOptions={defaultOptions}
        />
        <Filters defaultFilters={{
          modal: [true, true, true],
          form: [true, true],
          level: [true, true, true, true, true]
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