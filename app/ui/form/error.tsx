import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function ErrorMessage({ msg }: { msg?: string }) {
  return (
    <div
      className="flex items-center h-8 items-end space-x-1"
      aria-live="polite"
      aria-atomic="true"
    >
      {msg && (
        <>
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-500">{msg}</p>
        </>
      )}
    </div>
  )
}