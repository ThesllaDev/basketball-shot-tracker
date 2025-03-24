import HistoryGrid from "./HistoryGrid";
import ShootingStats from "./ShootingStats";
import Training from "./Training";

export default function AllSections() {
	return (
		<div className="tab-content-style">
			<Training />
			<HistoryGrid />
			<ShootingStats />
		</div>
	);
}