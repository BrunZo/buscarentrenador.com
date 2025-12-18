'use client'

import { useState } from 'react';
import Filters from "../entrenadores/filters";
import LocationFilter from "../entrenadores/location_filter";
import Button from "../form/button";
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import argProvinces from '@/lib/arg-provinces.json';

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
  const [description, setDescription] = useState('');
  const [achievements, setAchievements] = useState<string[]>(['']);

  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const removeAchievement = (index: number) => {
    if (achievements.length > 1) {
      setAchievements(achievements.filter((_, i) => i !== index));
    }
  };

  const updateAchievement = (index: number, value: string) => {
    const updated = [...achievements];
    updated[index] = value;
    setAchievements(updated);
  };

  return (
    <>
      <form className='w-full md:w-full lg:w-1/2 space-y-2'>
        <p>Completá tu información para registrarte como entrenador.</p>
        
        <LocationFilter
          cities={cities}
          provinces={argProvinces}
          defaultOptions={{ prov: defaultOptions.prov, city: defaultOptions.city }}
        />
        
        <div>
          <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
            Descripción
          </label>
          <textarea
            id='description'
            name='description'
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Escribí una breve descripción sobre vos como entrenador...'
            className='w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 focus:outline-indigo-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Logros / Certificaciones
          </label>
          <div className='space-y-2'>
            {achievements.map((achievement, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  placeholder='Ej: Medalla de oro OMA 2020'
                  className='flex-1 rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 focus:outline-indigo-500'
                />
                {achievements.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeAchievement(index)}
                    className='p-2 text-gray-500 hover:text-red-600'
                    aria-label='Eliminar logro'
                  >
                    <XMarkIcon className='h-5 w-5' />
                  </button>
                )}
              </div>
            ))}
            <button
              type='button'
              onClick={addAchievement}
              className='flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800'
            >
              <PlusIcon className='h-4 w-4' />
              Agregar logro
            </button>
          </div>
        </div>

        <Filters defaultFilters={{
          place: defaultOptions.place,
          group: defaultOptions.group,
          level: defaultOptions.level
        }} />
        
        <Button text='Publicar información' />
      </form>
    </>
  )
}
