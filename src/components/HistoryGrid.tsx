import { useCallback, useState } from "react";
import { useStore } from "../store";
import { Grid, GridColumn, GridEditChangeEvent } from "@progress/kendo-react-grid";
interface GridRemoveEvent {
	dataItem: any;
}

export default function HistoryGrid() {
	const { shots, updateShot, deleteShot, calculateTotals, calculateStatsByType } = useStore();
	const [edit, setEdit] = useState({});

	const handleItemChange = useCallback(
		(event: { dataItem: any; field?: string; value: any }) => {
			if (!event.field) return;
			const updatedShot = { ...event.dataItem, [event.field]: event.value };
			updateShot(updatedShot);

			calculateTotals();
			calculateStatsByType();
		},
		[updateShot, calculateTotals, calculateStatsByType]
	);

	const handleEditChange = (event: GridEditChangeEvent) => {
		setEdit(event.edit);
	};

	const handleRowRemove = useCallback(
		(event: GridRemoveEvent) => {
			deleteShot(event.dataItem.id);

			calculateTotals();
			calculateStatsByType();
		},
		[deleteShot, calculateTotals, calculateStatsByType]
	);

	return (
		<section className="section-style">
			<h2 style={{ textAlign: "center" }} >History</h2>
			<Grid
				autoProcessData={true}
				data={shots}
				dataItemKey="id"
				defaultSkip={0}
				defaultTake={5}
				edit={edit}
				editable={{ mode: "incell" }}
				filterable={true}
				pageable={{ type: "input" }}
				resizable={true}
				sortable={true}
				style={{ maxWidth: "760px", width: "100%" }}
				onItemChange={handleItemChange}
				onEditChange={handleEditChange}
			>
				<GridColumn
					editor="date"
					field="date"
					filter="date"
					format="{0:MM/dd/yyyy}"
					title="Date"
				/>
				<GridColumn
					editable={false}
					field="shot"
					title="Shot Type"
				/>
				<GridColumn field="made" title="FGM" editor="numeric" filter="numeric" />
				<GridColumn field="attempted" title="FGA" editor="numeric" filter="numeric" />
				<GridColumn
					editable={false}
					field="percentage"
					filter="numeric"
					format="{0:n2}%"
					title="FG%"
				/>
				<GridColumn
					cell={(props) => (
						<td>
							<button
								onClick={() => handleRowRemove({ dataItem: props.dataItem })}
							>
								Delete
							</button>
						</td>
					)}
					filterable={false}
					title="Actions"
					width="120px"
				/>
			</Grid>
		</section>
	);
};
