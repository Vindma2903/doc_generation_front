import { Input, InputProps } from "@nextui-org/react"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"

export const InputPassword = ({ ...props }: InputProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <Input
      {...props}
      classNames={{
        input: "placeholder:text-placeholder",
        label: "text-md font-normal",
        inputWrapper: [
          "bg-white rounded-md border border-borderD min-h-9 h-9 placeholder-black",
          "group-data-[focus=true]:border-borderM group-data-[focus=true]:!bg-white group-data-[hover=true]:!bg-white !bg-white",
          "group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-offset-2 group-data-[focus=true]:ring-focus",
          "group-data-[invalid=true]:border-borderM group-data-[invalid=true]:ring-2 group-data-[invalid=true]:ring-offset-2 group-data-[invalid=true]:ring-invalid",
        ],
      }}
      endContent={
        <button
          aria-label="toggle password visibility"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeClosed className="max-w-5 text-borderD pointer-events-none" />
          ) : (
            <Eye className="max-w-5 text-borderD pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
    />
  )
}
