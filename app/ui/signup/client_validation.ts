const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

export const passwordChecks = {
  minLength: (password: string) => password.length >= 8,
  hasUppercase: (password: string) => /[A-Z]/.test(password),
  hasLowercase: (password: string) => /[a-z]/.test(password),
  hasNumber: (password: string) => /\d/.test(password),
};

export default function validateForm(formData: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const email = formData.get('email') as string;
  const passwordValue = formData.get('password') as string;
  const repeatPassword = formData.get('repeat') as string;
  const name = formData.get('name') as string;
  const surname = formData.get('surname') as string;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'El correo electrónico no es válido';
  }

  if (!name || name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  } else if (!nameRegex.test(name)) {
    errors.name = 'El nombre solo puede contener letras y espacios';
  }

  if (!surname || surname.length < 2) {
    errors.surname = 'El apellido debe tener al menos 2 caracteres';
  } else if (!nameRegex.test(surname)) {
    errors.surname = 'El apellido solo puede contener letras y espacios';
  }

  if (!passwordValue || passwordValue.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  } else if (!Object.values(passwordChecks).every(check => check(passwordValue))) {
    errors.password = 'La contraseña no cumple con todos los requisitos';
  }

  if (passwordValue !== repeatPassword) {
    errors.repeat = 'Las contraseñas no coinciden';
  }

  return errors;
};