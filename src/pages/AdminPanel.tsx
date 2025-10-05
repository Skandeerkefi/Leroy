import { useState, useEffect } from "react";
import { useGuessStore } from "../store/guessStore";

interface Props {
	token: string;
}

export default function AdminPanel({ token }: Props) {
	const [balance, setBalance] = useState("");
	const { createGame, resetGame, fetchGuesses, guesses, message, loading } =
		useGuessStore();

	useEffect(() => {
		fetchGuesses(token);
	}, [token, fetchGuesses]);

	return (
		<div className='max-w-lg p-6 mx-auto bg-gray-100 shadow-lg rounded-2xl'>
			<h2 className='mb-4 text-2xl font-bold'>⚙️ Admin Panel</h2>

			{/* Create Game */}
			<div className='mb-4'>
				<input
					type='number'
					value={balance}
					onChange={(e) => setBalance(e.target.value)}
					placeholder='Set Correct Balance'
					className='w-full p-2 mb-2 border rounded-lg'
				/>
				<button
					onClick={() => createGame(token, parseInt(balance))}
					disabled={loading}
					className='w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600'
				>
					{loading ? "Creating..." : "Create Game"}
				</button>
			</div>

			{/* Reset */}
			<button
				onClick={() => resetGame(token)}
				className='w-full px-4 py-2 mb-4 text-white bg-red-500 rounded-lg hover:bg-red-600'
			>
				Reset Game
			</button>

			{message && <p className='mb-4 text-center'>{message}</p>}

			{/* Guesses */}
			<h3 className='mb-2 text-lg font-semibold'>📋 Player Guesses</h3>
			<ul className='p-3 overflow-y-auto bg-white shadow-inner rounded-xl max-h-64'>
				{guesses.length === 0 ? (
					<p className='text-center text-gray-500'>No guesses yet</p>
				) : (
					guesses.map((g, i) => (
						<li
							key={i}
							className='flex justify-between p-2 border-b last:border-none'
						>
							<span>{g.username}</span>
							<span className='font-semibold'>{g.guessedNumber}</span>
						</li>
					))
				)}
			</ul>
		</div>
	);
}
