// separar usuario y entrenador?
export type User = {
  id:   string
  email:  string
  password: string
  name: string
  entr: boolean
  loc:  string
  prov: string
  mod:  boolean[]
  form: boolean[]
  level:  boolean[]
};