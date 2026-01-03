import argCities from '@/lib/loc/data/arg-cities.json';

export default function getCities() {
  const cities = argCities.localidades.map((city: { nombre: string, provincia: { nombre: string } }) => ({
    name: city.nombre,
    prov: city.provincia.nombre
  }));
  return cities;
}