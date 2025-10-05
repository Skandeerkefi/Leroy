import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGuessStore } from "@/store/guessStore";
import GraphicalBackground from "@/components/GraphicalBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const GuessBalancePage = () => {
	const user = useAuthStore((state) => state.user);
	const token = localStorage.getItem("token") || "";

	const { guesses, status, message, loading, fetchGuesses, submitGuess } =
		useGuessStore();

	const [guessInput, setGuessInput] = useState("");
	const [correctBalance, setCorrectBalance] = useState<number | null>(null);

	// Fetch guesses and correct balance
	useEffect(() => {
		if (token && user) {
			fetchGuesses(token, user.id);

			// Fetch correct balance if user is admin
			if (user.role === "admin") {
				fetch("https://leroydata.onrender.com/api/guess/balance/current", {
					headers: { Authorization: `Bearer ${token}` },
				})
					.then((res) => res.json())
					.then((data) => setCorrectBalance(data.correctBalance))
					.catch((err) => console.error(err));
			}

			const interval = setInterval(() => fetchGuesses(token, user.id), 20000);
			return () => clearInterval(interval);
		}
	}, [token, user, fetchGuesses]);

	const handleSubmit = async () => {
		if (!user) return alert("⚠️ Please login to submit a guess!");
		if (!guessInput) return alert("⚠️ Enter a number first!");

		await submitGuess(token, Number(guessInput), user.id);
		setGuessInput("");
	};

	return (
		<div className='relative flex flex-col min-h-screen'>
			<GraphicalBackground />
			<Navbar />

			<main className='flex flex-col items-center justify-center flex-1 px-6 py-16 text-center text-white'>
				<div className='w-full max-w-xl p-8 border shadow-lg bg-black/60 backdrop-blur-md rounded-3xl border-white/10'>
					<h1 className='mb-6 text-3xl font-bold text-[#fc0c2b]'>
						🎯 Guess the Balance
					</h1>

					{/* Guess input */}
					{user ? (
						status === "submitted" ? (
							<p className='text-lg font-semibold text-green-400'>
								✅ You already submitted your guess!
							</p>
						) : (
							<div className='flex flex-col items-center justify-center gap-3 mb-6 sm:flex-row'>
								<input
									type='number'
									value={guessInput}
									onChange={(e) => setGuessInput(e.target.value)}
									placeholder='Enter your guess'
									className='w-full sm:w-1/2 p-3 rounded-lg border border-white/20 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-[#fc0c2b]'
								/>
								<Button
									onClick={handleSubmit}
									disabled={loading}
									className='bg-[#fc0c2b] text-black font-bold hover:scale-105 transition-transform'
								>
									Submit
								</Button>
							</div>
						)
					) : (
						<p className='mb-6 text-gray-300'>
							🔒 Login to submit your guess — but you can still see others
							below!
						</p>
					)}

					{message && (
						<p className='mt-2 text-sm font-medium text-white'>{message}</p>
					)}

					{/* All guesses */}
					<div className='mt-10 text-left'>
						<h2 className='mb-4 text-2xl font-semibold text-[#fc0c2b]'>
							All Submitted Guesses
						</h2>
						<div className='space-y-2 overflow-y-auto max-h-60'>
							{guesses.length > 0 ? (
								guesses.map((g, index) => {
									const isCorrect =
										user?.role === "admin" &&
										correctBalance !== null &&
										g.guessedNumber === correctBalance;

									return (
										<div
											key={index}
											className={`flex justify-between p-3 text-sm border rounded-lg ${
												isCorrect
													? "bg-green-600/50 border-green-400 text-white font-semibold"
													: "bg-white/10 border-white/20 text-white"
											}`}
										>
											<span>User: {g.username}</span>
											<span>Guess: {g.guessedNumber}</span>
										</div>
									);
								})
							) : (
								<p className='text-gray-300'>No guesses submitted yet.</p>
							)}
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default GuessBalancePage;
