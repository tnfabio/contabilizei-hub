import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";

import { WidgetBody } from "@/components/BentoWidgets";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sizeClasses, type Widget } from "@/lib/widgets";

function SortableBlock({
  widget,
  index,
  editing,
  onRemove,
}: {
  widget: Widget;
  index: number;
  editing: boolean;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
    disabled: !editing,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        animationDelay: `${index * 70}ms`,
      }}
      className={cn(
        "glass-card bento-in relative overflow-hidden rounded-3xl",
        sizeClasses[widget.size],
        !editing && "glow-hover",
        editing && !isDragging && "bento-wiggle",
        isDragging && "z-20 opacity-90 shadow-2xl",
      )}
    >
      <WidgetBody widget={widget} />

      {editing && (
        <>
          <div className="absolute inset-0 bg-background/20" />
          <div className="absolute right-2 top-2 flex gap-1.5">
            <button
              type="button"
              aria-label="Arrastar bloco"
              className="grid size-8 cursor-grab place-items-center rounded-full bg-primary text-primary-foreground active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="size-4" />
            </button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              aria-label="Excluir bloco"
              className="size-8 rounded-full"
              onClick={() => onRemove(widget.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export function BentoGrid({
  widgets,
  editing,
  onReorder,
  onRemove,
}: {
  widgets: Widget[];
  editing: boolean;
  onReorder: (from: number, to: number) => void;
  onRemove: (id: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorder(
      widgets.findIndex((w) => w.id === active.id),
      widgets.findIndex((w) => w.id === over.id),
    );
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
        <div className="grid auto-rows-[minmax(9rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {widgets.map((widget, index) => (
            <SortableBlock
              key={widget.id}
              widget={widget}
              index={index}
              editing={editing}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
