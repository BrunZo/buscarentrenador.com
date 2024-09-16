export type User = {
  id:   string
  email:  string
  password: string
  name: string
  entr: boolean
};

export type Entrenador = {
  id: string
  email: string
  password: string
  name: string
  loc: string
  prov: string
  mod: string
  form: string
  level: string
};