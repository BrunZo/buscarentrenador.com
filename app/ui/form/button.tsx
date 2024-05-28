import clsx from "clsx";
import { useFormStatus } from "react-dom";

export default function Button({ text }: {
  text: string
}) {
  const { pending } = useFormStatus();
  
  return (
    <>
      <div className='flex'>
        <button
          type="submit"
          className={clsx({
            "w-full flex justify-center py-2 px-4": true,
            "border border-transparent rounded-md shadow-sm text-sm font-medium text-white": true,
            "bg-indigo-600 hover:bg-indigo-700": !pending,
            "bg-indigo-200": pending,
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500": true
          })}
          aria-disabled={pending}
          disabled={pending}
        >
          { text }
        </button>
      </div>
    </>
  )
}