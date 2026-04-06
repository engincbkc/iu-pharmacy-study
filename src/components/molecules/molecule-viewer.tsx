import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { moleculeNodeTypes } from "./molecule-nodes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MoleculeData } from "@/types";

interface MoleculeViewerProps {
  molecule: MoleculeData;
}

export function MoleculeViewer({ molecule }: MoleculeViewerProps) {
  const initialNodes: Node[] = useMemo(
    () =>
      molecule.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
        draggable: false,
      })),
    [molecule.nodes]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      molecule.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: "default",
        label: e.type === "double" ? "=" : e.type === "triple" ? "≡" : undefined,
        style: {
          strokeWidth: e.type === "double" ? 3 : e.type === "triple" ? 4 : 2,
          stroke: "#71717a",
        },
        labelStyle: { fontSize: 14, fontWeight: 700, fill: "#71717a" },
      })),
    [molecule.edges]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onInit = useCallback((instance: { fitView: () => void }) => {
    setTimeout(() => instance.fitView(), 50);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{molecule.name}</CardTitle>
        <CardDescription>{molecule.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] rounded-md border bg-zinc-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={moleculeNodeTypes}
            onInit={onInit}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            zoomOnScroll
            proOptions={{ hideAttribution: true }}
          >
            <Controls showInteractive={false} />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#d4d4d8" />
          </ReactFlow>
        </div>

        {molecule.sarAnnotations && molecule.sarAnnotations.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold">SAR Annotations</h4>
            <div className="flex flex-wrap gap-2">
              {molecule.sarAnnotations.map((a, i) => (
                <div key={i} className="rounded-md border bg-muted/30 px-3 py-2 text-xs">
                  <Badge variant="secondary" className="mb-1">
                    {a.text}
                  </Badge>
                  <p className="text-muted-foreground">{a.effect}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
