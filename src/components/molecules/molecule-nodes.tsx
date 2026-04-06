import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface AtomData {
  label: string;
  element?: string;
  charge?: string;
}

const elementColors: Record<string, string> = {
  C: "bg-zinc-700 text-white",
  N: "bg-blue-600 text-white",
  O: "bg-red-600 text-white",
  S: "bg-yellow-500 text-black",
  F: "bg-green-500 text-white",
  R: "bg-zinc-400 text-white",
  ring: "bg-zinc-200 text-zinc-800 border-zinc-400",
};

export const AtomNode = memo(function AtomNode({ data }: NodeProps) {
  const d = data as unknown as AtomData;
  const colorClass = elementColors[d.element ?? "C"] ?? "bg-zinc-500 text-white";

  return (
    <div
      className={cn(
        "flex h-10 min-w-10 items-center justify-center rounded-full border px-2 text-xs font-bold shadow-sm",
        colorClass
      )}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />
      {d.label}
      {d.charge && <sup className="ml-0.5 text-[10px]">{d.charge}</sup>}
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
});

export const FunctionalGroupNode = memo(function FunctionalGroupNode({ data }: NodeProps) {
  const d = data as unknown as AtomData;
  const colorClass = elementColors[d.element ?? "R"] ?? "bg-zinc-300 text-zinc-800";

  return (
    <div
      className={cn(
        "flex h-9 items-center justify-center rounded-md border px-3 text-xs font-semibold shadow-sm",
        colorClass
      )}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />
      {d.label}
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
});

export const BondLabelNode = memo(function BondLabelNode({ data }: NodeProps) {
  const d = data as unknown as AtomData;
  return (
    <div className="rounded bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
      <Handle type="target" position={Position.Left} className="opacity-0" />
      {d.label}
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
});

export const moleculeNodeTypes = {
  atom: AtomNode,
  "functional-group": FunctionalGroupNode,
  "bond-label": BondLabelNode,
};
