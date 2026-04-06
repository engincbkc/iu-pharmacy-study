import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

function RadioGroup({
  className,
  value,
  onValueChange,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <div
      className={cn("grid gap-2", className)}
      role="radiogroup"
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioGroupItemProps>(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onSelect: () => onValueChange?.(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
}

interface RadioGroupItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  checked?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

function RadioGroupItem({
  className,
  value: _value,
  checked,
  onSelect,
  disabled,
  children,
  ...props
}: RadioGroupItemProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-left text-sm transition-colors hover:bg-accent active:scale-[0.99]",
        checked && "border-primary bg-accent",
        disabled && "cursor-not-allowed opacity-50 active:scale-100",
        className
      )}
      onClick={onSelect}
      {...props}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary",
          checked && "bg-primary"
        )}
      >
        {checked && (
          <span className="h-2 w-2 rounded-full bg-primary-foreground" />
        )}
      </span>
      {children}
    </button>
  );
}

export { RadioGroup, RadioGroupItem };
