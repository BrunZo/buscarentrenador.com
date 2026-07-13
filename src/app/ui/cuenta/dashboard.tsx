"use client";

import { useState } from "react";
import Link from "next/link";
import type { TrainerWithEmail } from "@/types/trainers";
import type { SessionUser } from "@/types/users";
import AccountInfo from "@/app/ui/cuenta/account_info";
import ChangePassword from "@/app/ui/cuenta/change_password";
import VerticalNavbar, {
  type NavOption,
} from "@/app/ui/cuenta/vertical_navbar";
import TrainerProfile from "@/app/ui/cuenta/trainer_profile";
import Students from "@/app/ui/cuenta/students";

export default function Dashboard({
  user,
  trainer,
  hasPassword,
}: {
  user: SessionUser;
  trainer: TrainerWithEmail | null;
  hasPassword: boolean;
}) {
  const [selected, setSelected] = useState(0);

  const options: NavOption[] = [{ label: "Mi cuenta" }];
  if (trainer) {
    options.push({ label: "Perfil de entrenador" });
    options.push({ label: "Mis alumnos" });
  } else {
    options.push({ label: "Soy entrenador", href: "/soy-entrenador" });
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <VerticalNavbar
        options={options}
        selected={selected}
        handler={setSelected}
      />
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-large border border-gray-100 p-6 md:p-8">
          {selected === 0 && (
            <div className="space-y-8">
              <AccountInfo user={user} />
              {!trainer && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-50 to-purple-50">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      ¿Sos entrenador?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Aún no tenés un perfil de entrenador. Creá el tuyo para
                      aparecer en las búsquedas.
                    </p>
                  </div>
                  <Link
                    href="/soy-entrenador"
                    className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Registrate acá
                  </Link>
                </div>
              )}
              <ChangePassword hasPassword={hasPassword} />
            </div>
          )}
          {trainer && selected === 1 && <TrainerProfile trainer={trainer} />}
          {trainer && selected === 2 && <Students />}
        </div>
      </div>
    </div>
  );
}
