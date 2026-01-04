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
    place: boolean[],
    group: boolean[],
    level: boolean[],
  },
}) {
  const router = useRouter();
  const [description, setDescription] = useState(defaultOptions.description);
  const [achievements, setAchievements] = useState<string[]>(defaultOptions.certifications);
  const [province, setProvince] = useState(defaultOptions.prov);
  const [city, setCity] = useState(defaultOptions.city);
  const [place, setPlace] = useState<boolean[]>(defaultOptions.place);
  const [group, setGroup] = useState<boolean[]>(defaultOptions.group);
  const [level, setLevel] = useState<boolean[]>(defaultOptions.level);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // TODO: errorMessage is missing

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

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
          place,
          group,
          level,
          certifications,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar la información');
      }

      router.push('/cuenta');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
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
        <FilterGrid 
          filters={trainerFilters} 
          defaultStates={{
            place: defaultOptions.place,
            group: defaultOptions.group,
            level: defaultOptions.level,
          }} 
          replaceUrl={false}
          onPlaceChange={setPlace}
          onGroupChange={setGroup}
          onLevelChange={setLevel}
        />

        <Button text={isSubmitting ? 'Guardando...' : 'Publicar información'} disabled={isSubmitting} />
      </form>
    </>
  )
}
