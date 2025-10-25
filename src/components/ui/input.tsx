import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import * as React from "react";
const inputVariants = cva(
  "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-zinc-200/70 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-black focus-visible:ring-ring/50 focus-visible:ring-[0px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "h-9",
        lg: "h-12",
        sm: "h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
export type InputProps = Omit<
  React.ComponentProps<"input"> & {
    rightIcon?: React.ReactNode;
    leftIcon?: React.ReactNode;
  },
  "size"
> &
  VariantProps<typeof inputVariants>;
function Input({
  rightIcon,
  className,
  leftIcon,
  variant,
  size,
  type,
  ...props
}: InputProps) {
  if (leftIcon || rightIcon) {
    return (
      <div
        className={cn(
          "relative flex items-center focus-within:border-black focus-within:ring-0 focus-within:ring-ring/50",
          rightIcon ? "pr-0!" : "pl-0!",
          inputVariants({ variant, size, className })
        )}
      >
        {leftIcon && (
          <div className="flex items-center justify-center">{leftIcon}</div>
        )}
        <input
          type={type}
          data-slot="input"
          className="flex-1 bg-transparent border-none outline-none px-0 py-0 placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        {rightIcon && (
          <div className="flex items-center justify-center bg-transparent hover:bg-transparent">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size, className }))}
      {...props}
    />
  );
}
export { Input };
