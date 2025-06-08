import { Input as NextInput, InputProps } from "@nextui-org/react"

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <NextInput
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
    />
  )
}
