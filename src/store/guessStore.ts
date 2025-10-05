// store/guessStore.ts
import { create } from "zustand";
import axios from "axios";
import { Guess, GuessGame } from "./types";

const API_URL = "https://leroydata.onrender.com/api/guess";

interface GuessStore {
	game: GuessGame | null;
	guesses: Guess[];
	message: string;
	status: string | null;
	loading: boolean;

	fetchGuesses: (token: string, userId: string) => Promise<void>;
	submitGuess: (
		token: string,
		guessedNumber: number,
		userId: string
	) => Promise<void>;
}

export const useGuessStore = create<GuessStore>((set) => ({
	game: null,
	guesses: [],
	message: "",
	status: null,
	loading: false,

	fetchGuesses: async (token, userId) => {
		try {
			set({ loading: true });
			const res = await axios.get<Guess[]>(`${API_URL}/guesses`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const userHasSubmitted = res.data.some((g) => g.user === userId);
			set({ guesses: res.data, status: userHasSubmitted ? "submitted" : null });
		} catch (err: any) {
			set({ message: err.response?.data?.message || "Error fetching guesses" });
		} finally {
			set({ loading: false });
		}
	},

	submitGuess: async (token, guessedNumber, userId) => {
		try {
			set({ loading: true });
			const res = await axios.post(
				`${API_URL}/submit`,
				{ guessedNumber },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			set({ message: res.data.message, status: "submitted" });
			// Optionally, refresh the guesses list
			const guessesRes = await axios.get<Guess[]>(`${API_URL}/guesses`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			set({ guesses: guessesRes.data });
		} catch (err: any) {
			set({ message: err.response?.data?.message || "Error submitting guess" });
		} finally {
			set({ loading: false });
		}
	},
}));
