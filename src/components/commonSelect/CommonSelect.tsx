import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";

type OptionNode = {
  label: string;
  value: string | number;
  count?: string | number;
  children?: OptionNode[];
};

type CommonSelectProps = {
  options: OptionNode[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
};

export default function CommonSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  size,
}: CommonSelectProps) {
  // Recursive rendering of parent + children
  const renderNodes = (nodes: OptionNode[], depth = 1): React.ReactNode =>
    nodes.map((node) => (
      <React.Fragment key={node.value}>
        <SelectItem
          value={String(node.value)}
          // Tailwind can't read dynamic class like pl-${depth * 4}
          // Use inline style or a small helper instead:
          style={{ paddingLeft: depth * 8 }} // 1rem per depth
          className="capitalize cursor-pointer"
        >
          {node.label} {node?.count ? `(${node?.count})` : null}
        </SelectItem>
        {node.children && renderNodes(node.children, depth + 1)}
      </React.Fragment>
    ));

  const sizeClasses = {
    sm: "h-8 text-xs",
    default: "h-9 text-sm",
    lg: "h-10 text-base",
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        disabled={disabled}
        className={cn(
          "w-auto focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
          sizeClasses[size || "default"],
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{renderNodes(options)}</SelectContent>
    </Select>
  );
}

// "use client";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// type CommonSelectProps = {
//   options: { label: string; value: string | number }[];
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   className?: string;
//   name?: string;
//   disabled?: boolean;
//   size?: "sm" | "default" | "lg";
// };

// export default function CommonSelect({
//   options,
//   value,
//   onChange,
//   placeholder = "Select an option",
//   className = "",
//   disabled = false,
//   size,
// }: CommonSelectProps) {
//   return (
//     <Select value={value} onValueChange={onChange}>
//       <SelectTrigger
//         disabled={disabled}
//         className={`w-auto focus:outline-none focus:ring-1
//           focus:ring-primary
//            cursor-pointer ${className}`}
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         size={(size || "default") as any}
//       >
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>
//       <SelectContent>
//         {options.map((opt, i) => (
//           <SelectItem key={i} value={String(opt.value)} className="capitalize cursor-pointer">
//             {opt.label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }
