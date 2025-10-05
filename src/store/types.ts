// src/types.ts
export interface Guess {
	user: string; // userId (from MongoDB)
	username: string;
	guessedNumber: number;
	createdAt: string;
}

export interface GuessGame {
	_id: string;
	correctBalance: number;
	isActive: boolean;
	guesses: Guess[];
	winner?: Guess;
	createdAt: string;
}

export interface ApiResponse<T> {
	message: string;
	game?: GuessGame;
	data?: T;
}
