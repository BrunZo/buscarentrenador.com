import {
  BuildingStorefrontIcon,
  ComputerDesktopIcon,
  HomeIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const trainerFilters = [
  {
    name: 'place',
    options: ['Virtual', 'A domicilio', 'En dirección'],
    icons: [
      <ComputerDesktopIcon key={0} width={24} height={24} />, 
      <HomeIcon key={1} width={24} height={24} />, 
      <BuildingStorefrontIcon key={2} width={24} height={24} />
    ]
  },
  {
    name: 'group',
    options: ['Individual', 'Grupal'],
    icons: [
      <UserIcon key={0} width={24} height={24} />,
      <UserGroupIcon key={1} width={24} height={24} />
    ]
  },
  {
    name: 'level',
    options: ['Ñandú', '1', '2', '3', 'Avanzado'],
  }
]

export default trainerFilters;