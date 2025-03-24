import { useState } from "react";
import { useStore } from "../store";
import { Label } from '@progress/kendo-react-labels';
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { NumericTextBox } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Button } from '@progress/kendo-react-buttons';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Slide } from '@progress/kendo-react-animation';

export default function Training() {
	const { addShot, calculateTotals, shotTypes } = useStore();

	const [shotType, setShotType] = useState(shotTypes[1]);
	const [madeShots, setMadeShots] = useState<number | undefined>(undefined);
	const [attemptedShots, setAttemptedShots] = useState<number | undefined>(undefined);
	const [shotDate, setShotDate] = useState(new Date());
	const [notificationVisible, setNotificationVisible] = useState(false);
	const [errorVisible, setErrorVisible] = useState(false);

	const handleAddShot = () => {
		if (attemptedShots === undefined || madeShots === undefined || attemptedShots === 0 || madeShots > attemptedShots) {

			setErrorVisible(true);

			setTimeout(() => {
				setErrorVisible(false);
			}, 6000);

			return;
		}

		addShot({
			date: shotDate,
			shot: shotType,
			attempted: attemptedShots ?? 0,
			made: madeShots ?? 0,
			percentage: (madeShots / attemptedShots) * 100,
		});

		calculateTotals();

		setNotificationVisible(true);

		setTimeout(() => {
			setNotificationVisible(false);
		}, 3000);
	};

	return (
		<aside className="section-style">
			<h2 style={{ textAlign: "center" }} >Training</h2>
			<blockquote style={{ textAlign: "center" }}>
				<p>"Train your mind, train your body, train your shot."</p>
			</blockquote>
			<section>
				<h2 style={{ textAlign: "center" }}>Shot Tracker</h2>
				<div>
					<Label editorId='shotType'>Choose a Shot Type:</Label>
					<DropDownList
						id={'shotType'}
						data={shotTypes.slice(1)}
						value={shotType}
						onChange={(e) => setShotType(e.value)}
					/>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<NumericTextBox
						label="Made Shots"
						value={madeShots ?? undefined}
						onChange={(e) => setMadeShots(Number(e.target.value))}
						min={0}
						width={150}
					/>
					<NumericTextBox
						label="Attempted Shots"
						value={attemptedShots ?? undefined}
						onChange={(e) => setAttemptedShots(Number(e.target.value))}
						min={0}
						width={150}
					/>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<DatePicker
						label='Select Date'
						format='dd/MM/yyyy'
						value={shotDate}
						onChange={(e) => e.value && setShotDate(e.value)}
						width={200}
					/>
					<Button onClick={handleAddShot}>Add Shot</Button>
				</div>
			</section>

			<NotificationGroup
				style={{
					right: 0,
					top: 0,
					alignItems: 'flex-start',
					flexWrap: 'wrap-reverse',
				}}
			>
				<Slide direction={notificationVisible ? 'down' : 'up'} >
					{notificationVisible && (
						<Notification
							type={{ style: 'success', icon: true }}
							closable={true}
							onClose={() => setNotificationVisible(false)}
							style={{ padding: 10 }}
						>
							<span>Your data has been saved.</span>
						</Notification>
					)}
				</Slide>

				<Slide direction={errorVisible ? 'down' : 'up'} >
					{errorVisible && (
						<Notification
							type={{ style: 'error', icon: true }}
							closable={true}
							onClose={() => setErrorVisible(false)}
							style={{ padding: 10 }}
						>
							<span>
								Made shots cannot be greater than attempted shots! And attempted shots{" "}
								cannot be 0. Please try again.
							</span>
						</Notification>
					)}
				</Slide>
			</NotificationGroup>
		</aside>
	);
}
