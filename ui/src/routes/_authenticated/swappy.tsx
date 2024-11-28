import {
	DragDropContext,
	Draggable,
	type DraggableProvided,
	type DraggableStateSnapshot,
	type DropResult,
	Droppable,
	type DroppableProvided,
} from "@hello-pangea/dnd";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/swappy")({
	component: () => <SwappyTest />,
});

interface Item {
	id: string;
	title: string;
	content: string;
}

const initial_items: Item[] = [
	{ id: 1, title: "first", content: "content" },
	{ id: 2, title: "second", content: "content" },
	{ id: 3, title: "third", content: "content" },
];

const reorder = (
	list: Item[],
	startIndex: number,
	endIndex: number,
): Item[] => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};

const move = (
	source: Item[],
	destination: Item[],
	droppableSource: { index: number },
	droppableDestination: { index: number },
): { [key: string]: Item[] } => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	return {
		source: sourceClone,
		destination: destClone,
	};
};

const SwappyTest = () => {
	const [items, setItems] = useState<Item[]>(initial_items);
	const [selected, setSelected] = useState<Item[]>([]);

	const onDragEnd = (result: DropResult): void => {
		const { source, destination } = result;

		if (!destination) {
			return;
		}

		if (source.droppableId === destination.droppableId) {
			const list = source.droppableId === "droppable" ? items : selected;
			const reorderedList = reorder(list, source.index, destination.index);

			if (source.droppableId === "droppable") {
				setItems(reorderedList);
			} else {
				setSelected(reorderedList);
			}
		} else {
			const sourceList = source.droppableId === "droppable" ? items : selected;
			const destList =
				destination.droppableId === "droppable" ? items : selected;
			const result = move(sourceList, destList, source, destination);

			setItems(
				source.droppableId === "droppable" ? result.source : result.destination,
			);
			setSelected(
				source.droppableId === "droppable" ? result.destination : result.source,
			);
		}
	};

	return (
		<div className="flex justify-center items-start space-x-4 p-4">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="droppable">
					{(provided: DroppableProvided, snapshot) => (
						<div
							ref={provided.innerRef}
							className={`bg-gray-200 p-4 w-64 rounded-lg ${snapshot.isDraggingOver ? "bg-blue-100" : ""}`}
							{...provided.droppableProps}
						>
							<h2 className="text-lg font-bold mb-2">Items</h2>
							{items.map((item, index) => (
								<Draggable key={item.id} draggableId={item.title} index={index}>
									{(
										provided: DraggableProvided,
										snapshot: DraggableStateSnapshot,
									) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className={`p-2 mb-2 bg-white rounded shadow ${snapshot.isDragging ? "bg-green-200" : ""}`}
										>
											<h3 className="font-semibold">{item.title}</h3>
											<p>{item.content}</p>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				<Droppable droppableId="droppable2">
					{(provided: DroppableProvided, snapshot) => (
						<div
							ref={provided.innerRef}
							className={`bg-gray-200 p-4 w-64 rounded-lg ${snapshot.isDraggingOver ? "bg-blue-100" : ""}`}
							{...provided.droppableProps}
						>
							<h2 className="text-lg font-bold mb-2">Selected</h2>
							{selected.map((item, index) => (
								<Draggable key={item.id} draggableId={item.title} index={index}>
									{(
										provided: DraggableProvided,
										snapshot: DraggableStateSnapshot,
									) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className={`p-2 mb-2 bg-white rounded shadow ${snapshot.isDragging ? "bg-green-200" : ""}`}
										>
											<h3 className="font-semibold">{item.title}</h3>
											<p>{item.content}</p>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	);
};
