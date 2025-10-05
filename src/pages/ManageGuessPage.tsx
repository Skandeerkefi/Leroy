import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import GraphicalBackground from "@/components/GraphicalBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const ManageGuessPage = () => {
	const user = useAuthStore((state) => state.user);
	const [balance, setBalanceInput] = useState("");
	const [currentBalance, setCurrentBalance] = useState<number | null>(null);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const token = localStorage.getItem("token");

	// Fetch current balance when page loads
	useEffect(() => {
		if (!token) return;

		const fetchCurrentBalance = async () => {
			try {
				const res = await fetch(
					"https://leroydata.onrender.com/api/guess/balance/current",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const data = await res.json();
				if (res.ok) setCurrentBalance(data.correctBalance);
			} catch (err) {
				console.error("Error fetching current balance:", err);
			}
		};

		fetchCurrentBalance();
	}, [token]);

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
			const res = await fetch(
				"https://leroydata.onrender.com/api/guess/create",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ correctBalance: Number(balance) }),
				}
			);

			const data = await res.json();

			if (res.ok) {
				setMessage(`✅ Correct balance set: ${balance}`);
				setBalanceInput("");
				setCurrentBalance(Number(balance)); // update displayed current balance
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

	if (!user)
		return (
			<div className='relative min-h-screen'>
				<GraphicalBackground />
				<Navbar />
				<div className='flex flex-col items-center justify-center min-h-[80vh] text-white'>
					<p className='px-6 py-3 text-xl font-semibold rounded-lg bg-black/60'>
						Please login to manage the game.
					</p>
				</div>
				<Footer />
			</div>
		);

	return (
		<div className='relative flex flex-col min-h-screen'>
			<GraphicalBackground />
			<Navbar />

			<main className='flex items-center justify-center flex-1 px-6 py-16 text-white'>
				<div className='w-full max-w-md p-8 border shadow-lg bg-black/60 backdrop-blur-md border-white/10 rounded-3xl'>
					<h1 className='text-3xl font-bold mb-6 text-center text-[#fc0c2b]'>
						🎯 Manage Guess Game
					</h1>

					{currentBalance !== null && (
						<p className='mb-4 text-lg font-medium text-center text-green-400'>
							💰 Current Balance: {currentBalance}
						</p>
					)}

					<div className='flex flex-col items-center gap-3 mb-6 sm:flex-row'>
						<input
							type='number'
							value={balance}
							onChange={(e) => setBalanceInput(e.target.value)}
							placeholder='Enter correct balance'
							className='w-full p-3 rounded-lg border border-white/20 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-[#fc0c2b]'
						/>
						<Button
							onClick={setBalance}
							disabled={loading}
							className='bg-[#fc0c2b] text-black font-bold w-full sm:w-auto hover:scale-105 transition-transform'
						>
							{loading ? "Setting..." : "Set Balance"}
						</Button>
					</div>

					{message && (
						<p
							className={`text-sm text-center font-medium ${
								message.startsWith("✅")
									? "text-green-400"
									: message.startsWith("⚠️")
									? "text-yellow-400"
									: "text-red-400"
							}`}
						>
							{message}
						</p>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default ManageGuessPage;
