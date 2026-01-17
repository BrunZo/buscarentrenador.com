import { useMemo } from "react";
import { passwordChecks } from "./client_validation";

export default function PasswordStrengthIndicator({ password }: { password: string }) {
  const checks = useMemo(() => ({
    minLength: passwordChecks.minLength(password),
    hasUppercase: passwordChecks.hasUppercase(password),
    hasLowercase: passwordChecks.hasLowercase(password),
    hasNumber: passwordChecks.hasNumber(password),
  }), [password]);

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const strengthPercentage = (passedChecks / 4) * 100;

  const getStrengthColor = () => {
    if (strengthPercentage <= 25) return 'bg-red-500';
    if (strengthPercentage <= 50) return 'bg-orange-500';
    if (strengthPercentage <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strengthPercentage <= 25) return 'Débil';
    if (strengthPercentage <= 50) return 'Regular';
    if (strengthPercentage <= 75) return 'Fuerte';
    return 'Muy fuerte';
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 whitespace-nowrap">{getStrengthText()}</span>
      </div>
      
      <ul className="text-xs space-y-1">
        <li className={checks.minLength ? 'text-green-600' : 'text-gray-500'}>
          {checks.minLength ? '✓' : '○'} Mínimo 8 caracteres
        </li>
        <li className={checks.hasUppercase ? 'text-green-600' : 'text-gray-500'}>
          {checks.hasUppercase ? '✓' : '○'} Una letra mayúscula
        </li>
        <li className={checks.hasLowercase ? 'text-green-600' : 'text-gray-500'}>
          {checks.hasLowercase ? '✓' : '○'} Una letra minúscula
        </li>
        <li className={checks.hasNumber ? 'text-green-600' : 'text-gray-500'}>
          {checks.hasNumber ? '✓' : '○'} Un número
        </li>
      </ul>
    </div>
  );
}