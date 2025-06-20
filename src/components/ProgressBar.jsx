import { useEffect, useState } from "react";

export default function ProgressBar({timer}) {
	const [remainingTime, setRemainingTime] = useState(timer);

	useEffect(() => {
		const interval = setInterval(() => {
			setRemainingTime((prevTime) => prevTime - 10);
		}, 10);

		return () => {
			// make sure not to impact performance
			clearInterval(interval);
		};
	}, []);

  return <progress value={remainingTime} max={timer} />;
}
