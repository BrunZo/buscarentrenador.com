import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function AchievementList({ achievements, setAchievements }: {
  achievements: string[],
  setAchievements: (achievements: string[]) => void,
}) {
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
              placeholder={index === 0 ? 'Ej: Medalla de oro OMA 2020' : ''}
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
  )
}