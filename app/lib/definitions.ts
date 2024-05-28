export type User = {
  id:         string
  name:       string
  email:      string
  password:   string
  entrenador: boolean
  localidad:  string
  provincia:  string
  modalidad:  boolean[]
  formato:    boolean[]
  niveles:    boolean[]
};