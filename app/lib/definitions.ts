// separar usuario y entrenador?
export type User = {
  id:   string
  email:  string
  pass: string
  name: string
  entr: boolean
  loc:  string
  prov: string
  mod:  boolean[]
  form: boolean[]
  level:  boolean[]
};

// no se usa, usar
export type SessionData = {
  userId: string,
  isLoggedIn:   boolean,
  isEntrenador: boolean,
}