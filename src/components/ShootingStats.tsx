import { useState } from "react";
import { useStore } from "../store";
import { ExpansionPanel, ExpansionPanelContent } from "@progress/kendo-react-layout";
import { Reveal } from '@progress/kendo-react-animation';
import { Chart, ChartSeries, ChartSeriesItem } from "@progress/kendo-react-charts";

export default function ShootingStats() {
	const { shots } = useStore();
	const { statsByType, shotTypes } = useStore();

	const filteredShotTypes = shotTypes.filter((type) => type !== "All");

	const totalMakes = filteredShotTypes.reduce((sum, type) => sum + (statsByType[type]?.totalMade || 0), 0);
	const totalAttempts = filteredShotTypes.reduce((sum, type) => sum + (statsByType[type]?.totalAttempted || 0), 0);
	const shootingPercentage = totalAttempts > 0 ? (totalMakes / totalAttempts) * 100 : 0;

	const [expanded, setExpanded] = useState<string[]>([]);

	const sortedShots = [...shots].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	return (
		<section
			style={{
				display: "flex",
				flexWrap: "wrap",
				gap: "20px",
				justifyContent: "space-around",
				width: "100%"
			}}
			className="section-style"
		>
			<h2 style={{ textAlign: "center", width: "100%" }}>
				Stats
			</h2>
			<div
				style={{
					textAlign: "center",
					maxWidth: "376px",
				}}
				className="section-style"
			>
				<h3>Overview</h3>
				<header style={{ display: "flex", gap: "20px", justifyContent: "space-around", flexWrap: "wrap" }}>
					<div>
						<span style={{ fontSize: "xxx-large" }} >
							{totalMakes}/{totalAttempts}
						</span>
						<p>Total Makes / Total Attempts</p>
					</div>
					<div>
						<span style={{ fontSize: "xxx-large" }}>
							{shootingPercentage.toFixed(2)}%
						</span>
						<p>Field Goal Percentage</p>
					</div>
				</header>
				<h3>Shooting Stats</h3>
				{filteredShotTypes.map((type) => (
					<ExpansionPanel
						key={type}
						title={type}
						subtitle="Shooting Stats"
						expanded={expanded.includes(type)}
						onAction={
							(e) => setExpanded((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type])
						}
					>
						<Reveal>
							{expanded.includes(type) && (
								<ExpansionPanelContent>
									<ul style={{ padding: 0 }} >
										<li>
											Total Makes
											{
												statsByType[type]?.totalMade === undefined
													? <span>0</span>
													: <span>{statsByType[type]?.totalMade}</span>
											}
										</li>
										<li>
											Total Attempts
											{
												statsByType[type]?.totalAttempted === undefined
													? <span>0</span>
													: <span>{statsByType[type]?.totalAttempted}</span>
											}
										</li>
										<li>
											Field Goal Percentage
											{
												statsByType[type]?.percentage === undefined
													? <span>0%</span>
													: <span>{statsByType[type]?.percentage.toFixed(2)}%</span>
											}
										</li>
									</ul>
								</ExpansionPanelContent>
							)}
						</Reveal>
					</ExpansionPanel>
				))}
			</div>

			<Chart>
				<ChartSeries>
					<ChartSeriesItem
						type="line"
						data={sortedShots.map((shot) => shot.percentage)}
					/>
				</ChartSeries>
			</Chart>
		</section>
	);
};
