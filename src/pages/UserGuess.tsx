import { useState } from "react";
import { useGuessStore } from "../store/guessStore";

interface Props {
	token: string;
}

export default function UserGuess({ token }: Props) {
	const [number, setNumber] = useState("");
	const { submitGuess, message, loading } = useGuessStore();

	const handleSubmit = () => {
		if (!number) return;
		submitGuess(token, parseInt(number));
		setNumber("");
	};

	return (
		<div className='max-w-md p-4 mx-auto bg-white shadow-md rounded-2xl'>
			<h2 className='mb-2 text-xl font-bold'>🎯 Guess the Balance</h2>
			<input
				type='number'
				value={number}
				onChange={(e) => setNumber(e.target.value)}
				placeholder='Enter your guess'
				className='w-full p-2 mb-2 border rounded-lg'
			/>
			<button
				onClick={handleSubmit}
				disabled={loading}
				className='w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600'
			>
				{loading ? "Submitting..." : "Submit Guess"}
			</button>
			{message && <p className='mt-2 text-center'>{message}</p>}
		</div>
	);
}
