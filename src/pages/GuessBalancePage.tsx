import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const GuessBalancePage = () => {
	const user = useAuthStore((state) => state.user);
	const [guess, setGuess] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [message, setMessage] = useState("");
	const [guesses, setGuesses] = useState<any[]>([]);

	const token = localStorage.getItem("token");

	useEffect(() => {
		if (!token) return;

		const fetchGuesses = async () => {
			try {
				const res = await fetch("http://localhost:3000/api/guess/guesses", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await res.json();

				setGuesses(data);

				// For current user, check if already submitted
				const submitted = data.some((g: any) => g.user._id === user?.id);
				setStatus(submitted ? "submitted" : null);
			} catch (error) {
				console.error(error);
			}
		};

		fetchGuesses();
	}, [token, user]);

	const submitGuess = async () => {
		if (!guess) {
			setMessage("⚠️ Please enter a number!");
			return;
		}

		try {
			const res = await fetch("http://localhost:3000/api/guess/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ guessedNumber: Number(guess) }),
			});

			const data = await res.json();

			if (res.ok) {
				setMessage("✅ Guess submitted!");
				setStatus("submitted");
				setGuesses((prev) => [...prev, data]); // Update guesses list
			} else {
				setMessage(`❌ ${data.message || "Error submitting guess"}`);
			}
		} catch (error) {
			console.error(error);
			setMessage("❌ Something went wrong");
		}
	};

	if (!user)
		return <p className='p-4'>Please login to play Guess the Balance.</p>;

	return (
		<div className='p-6'>
			<h1 className='mb-4 text-2xl font-bold'>🎯 Guess the Balance</h1>

			{/* Guess input */}
			{status === "submitted" ? (
				<p className='text-green-600'>You already submitted your guess!</p>
			) : (
				<div className='mb-4 space-x-2'>
					<input
						type='number'
						value={guess}
						onChange={(e) => setGuess(e.target.value)}
						placeholder='Enter your guess'
						className='p-2 border rounded'
					/>
					<button
						onClick={submitGuess}
						className='px-4 py-2 text-white bg-blue-600 rounded'
					>
						Submit
					</button>
				</div>
			)}

			{message && <p className='mt-2'>{message}</p>}

			{/* Show all guesses */}
			<h2 className='mt-6 mb-2 text-xl font-semibold'>All Submitted Guesses</h2>
			<ul className='space-y-2'>
				{guesses.length > 0 ? (
					guesses.map((g: any, index: number) => (
						<li key={index} className='p-2 border rounded'>
							User: {g.user.kickUsername || g.user._id} | Guess:{" "}
							{g.guessedNumber}
						</li>
					))
				) : (
					<p>No guesses submitted yet.</p>
				)}
			</ul>
		</div>
	);
};

export default GuessBalancePage;
