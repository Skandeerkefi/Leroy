import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const ManageGuessPage = () => {
	const user = useAuthStore((state) => state.user);
	const [balance, setBalanceInput] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const token = localStorage.getItem("token");

	const setBalance = async () => {
		if (!token) {
			setMessage("❌ You must be logged in");
			return;
		}

		if (!balance) {
			setMessage("⚠️ Please enter a number");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("http://localhost:3000/api/guess/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ correctBalance: Number(balance) }),
			});

			const data = await res.json();

			if (res.ok) {
				setMessage(`✅ Correct balance set: ${balance}`);
				setBalanceInput(""); // clear input
			} else {
				setMessage(`❌ ${data.message || "Error setting balance"}`);
			}
		} catch (err) {
			console.error(err);
			setMessage("❌ Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	if (!user) return <p className='p-4'>Please login to manage the game.</p>;

	return (
		<div className='max-w-md p-6 mx-auto'>
			<h1 className='mb-4 text-2xl font-bold'>🎯 Manage Guess Game</h1>

			<div className='flex mb-4 space-x-2'>
				<input
					type='number'
					value={balance}
					onChange={(e) => setBalanceInput(e.target.value)}
					placeholder='Enter correct balance'
					className='flex-1 p-2 border rounded'
				/>
				<button
					onClick={setBalance}
					disabled={loading}
					className='px-4 py-2 text-white bg-blue-600 rounded'
				>
					{loading ? "Setting..." : "Set Balance"}
				</button>
			</div>

			{message && <p className='mt-2'>{message}</p>}
		</div>
	);
};

export default ManageGuessPage;
