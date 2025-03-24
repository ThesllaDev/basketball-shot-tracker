import { useState, useEffect } from "react";
import { useStore } from "./store";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import Training from "./components/Training";
import HistoryGrid from "./components/HistoryGrid";
import ShootingStats from "./components/ShootingStats";
import "@progress/kendo-theme-default/dist/all.css";
import "./App.scss";
import AllSections from "./components/AllSections";

const App = () => {
	const [selected, setSelected] = useState(0);
	const loadFromLocalStorage = useStore((state) => state.loadFromLocalStorage);

	useEffect(() => {
		loadFromLocalStorage();
	}, [loadFromLocalStorage]);

	const handleSelect = (e: any) => {
		setSelected(e.selected);
	};

	return (
		<main
			style={{
				padding: "20px",
				display: "flex",
				flexWrap: "wrap",
				justifyContent: "center",
				gap: "20px",
			}}
		>
			<h1 style={{ textAlign: "center", width: "100%" }}>
				🏀 Basketball Shot Tracker 🎯
			</h1>

			<TabStrip
				selected={selected}
				onSelect={handleSelect}
				tabAlignment="center"
				size={"large"}
				style={{ width: "100%" }}
			>
				<TabStripTab title="All">
					<AllSections />
				</TabStripTab>
				<TabStripTab title="Training" >
					<Training />
				</TabStripTab>
				<TabStripTab title="History" >
					<HistoryGrid />
				</TabStripTab>
				<TabStripTab title="Stats" >
					<ShootingStats />
				</TabStripTab>
			</TabStrip>
		</main>
	);
};

export default App;
