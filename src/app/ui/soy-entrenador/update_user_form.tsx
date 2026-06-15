'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterGrid from '@/app/ui/entrenadores/filters/filter_grid';
import trainerFilters from '@/app/ui/entrenadores/filters/trainer_filters';
import LocationFilter from '@/app/ui/entrenadores/loc/location_filter';
import Button from '@/app/ui/form/button';
import AchievementList from './achievement_list';

export default function UpdateUserForm({ defaultOptions }: {
  defaultOptions: {
    prov: string,
    city: string,
    description: string,
    certifications: string[],
    places: boolean[],
    groups: boolean[],
    levels: boolean[],
    soy_exo: boolean,
    examenes_oma: boolean,
  },
}) {
  const router = useRouter();
  const [description, setDescription] = useState(defaultOptions.description);
  const [achievements, setAchievements] = useState<string[]>(defaultOptions.certifications);
  const [province, setProvince] = useState(defaultOptions.prov);
  const [city, setCity] = useState(defaultOptions.city);
  const [places, setPlaces] = useState<boolean[]>(defaultOptions.places);
  const [groups, setGroups] = useState<boolean[]>(defaultOptions.groups);
  const [levels, setLevels] = useState<boolean[]>(defaultOptions.levels);
  const [soyExo, setSoyExo] = useState<boolean>(defaultOptions.soy_exo);
  const [examenesOma, setExamenesOma] = useState<boolean>(defaultOptions.examenes_oma);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const certifications = achievements.filter(a => a.trim() !== '');

      const response = await fetch('/api/auth/trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          province,
          city,
          description,
          places,
          groups,
          levels,
          certifications,
          soy_exo: soyExo,
          examenes_oma: soyExo ? examenesOma : false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar la información');
      }

      router.push('/cuenta');
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al guardar la información');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className='w-full md:w-full lg:w-1/2 space-y-2' onSubmit={handleSubmit}>
        <p>Completá tu información para registrarte como entrenador.</p>
        
        <LocationFilter
          defaultOptions={{ prov: defaultOptions.prov, city: defaultOptions.city }}
          replaceUrl={false}
          onProvinceChange={setProvince}
          onCityChange={setCity}
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

        <AchievementList achievements={achievements} setAchievements={setAchievements} />

        <div className='flex items-center justify-between py-1'>
          <label htmlFor='soy_exo' className='text-sm font-medium text-gray-700 select-none cursor-pointer'>
            Soy Exolímpico
          </label>
          <button
            id='soy_exo'
            type='button'
            role='switch'
            aria-checked={soyExo}
            onClick={() => setSoyExo(prev => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${soyExo ? 'bg-indigo-600' : 'bg-gray-300'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soyExo ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {soyExo && (
          <div className='flex items-center justify-between py-1'>
            <label htmlFor='examenes_oma' className='text-sm font-medium text-gray-700 select-none cursor-pointer pr-3'>
              Estoy dispuesto a participar en la toma de exámenes de OMA
            </label>
            <button
              id='examenes_oma'
              type='button'
              role='switch'
              aria-checked={examenesOma}
              onClick={() => setExamenesOma(prev => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${examenesOma ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${examenesOma ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        )}

        <FilterGrid
          filters={trainerFilters} 
          defaultStates={{
            place: defaultOptions.places,
            group: defaultOptions.groups,
            level: defaultOptions.levels,
          }} 
          replaceUrl={false}
          onPlaceChange={setPlaces}
          onGroupChange={setGroups}
          onLevelChange={setLevels}
        />

        {submitError && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-800 text-sm'>{submitError}</p>
          </div>
        )}

        <Button text={isSubmitting ? 'Guardando...' : 'Publicar información'} disabled={isSubmitting} />
      </form>
    </>
  )
}
