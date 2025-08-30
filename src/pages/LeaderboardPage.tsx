import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import {
	useLeaderboardStore,
	LeaderboardPlayer,
} from "@/store/useLeaderboardStore";
import { Crown, Info, Loader2, Trophy, Award, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GraphicalBackground from "@/components/GraphicalBackground";
import { useAuthStore } from "@/store/useAuthStore";

// Dark Red / Black / White palette
const COLORS = {
	primary: "#b91c1c",
	accent: "#f87171",
	dark: "#111111",
	light: "#f5f5f5",
};

function LeaderboardPage() {
	const { leaderboard, fetchLeaderboard, isLoading, error } =
		useLeaderboardStore();
	const { user } = useAuthStore();

	const [timeLeft, setTimeLeft] = useState("");

	// fetch leaderboard
	useEffect(() => {
		fetchLeaderboard();
	}, [fetchLeaderboard]);

	// Monthly countdown
	useEffect(() => {
		const updateCountdown = () => {
			const now = new Date();
			const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
			nextMonth.setHours(0, 0, 0, 0);

			const diff = nextMonth.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeLeft("Leaderboard period ended");
				return;
			}

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);

			setTimeLeft(
				`${days.toString().padStart(2, "0")}d ${hours
					.toString()
					.padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds
					.toString()
					.padStart(2, "0")}s remaining`
			);
		};

		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className='relative flex flex-col min-h-screen text-white bg-black'>
			<GraphicalBackground />
			<Navbar />

			<main className='container relative z-10 flex-grow max-w-6xl px-6 py-12 mx-auto'>
				{/* Header */}
				<div className='flex flex-col items-center justify-between gap-4 mb-10 sm:flex-row'>
					<div
						className='flex items-center gap-3'
						style={{ color: COLORS.primary }}
					>
						<Crown className='w-7 h-7' />
						<h1 className='text-3xl font-extrabold tracking-tight'>
							Rainbet Leaderboard
						</h1>
					</div>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									className='flex items-center gap-1 text-sm font-semibold transition-colors'
									style={{ color: COLORS.accent }}
								>
									<Info className='w-5 h-5' />
									How It Works
								</button>
							</TooltipTrigger>
							<TooltipContent
								className='max-w-xs p-3 text-sm border rounded-md shadow-lg'
								style={{
									backgroundColor: COLORS.dark,
									borderColor: COLORS.primary,
									color: COLORS.light,
								}}
							>
								The leaderboard ranks players based on their total wager amount
								using the LIKETHACHEESE affiliate code on Rainbet.
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Error */}
				{error && (
					<Alert
						variant='destructive'
						className='mb-8 shadow-md'
						style={{
							backgroundColor: `${COLORS.primary}40`,
							borderColor: COLORS.primary,
							color: COLORS.light,
						}}
					>
						<AlertDescription>
							Failed to load leaderboard: {error}
						</AlertDescription>
					</Alert>
				)}

				{/* Reward Cards */}
				<section className='mb-12'>
					<h2
						className='mb-8 text-3xl font-bold tracking-wide text-center'
						style={{ color: COLORS.primary }}
					>
						Top Players
					</h2>
					<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
						{leaderboard.length > 0 ? (
							<>
								<RewardCard
									position='2nd Place'
									reward='$75'
									player={leaderboard[1]}
									icon={<Award className='text-red-400 w-9 h-9' />}
								/>
								<RewardCard
									position='1st Place'
									reward='$150'
									player={leaderboard[0]}
									icon={<Trophy className='w-10 h-10 text-red-500' />}
								/>
								<RewardCard
									position='3rd Place'
									reward='$25'
									player={leaderboard[2]}
									icon={<Medal className='w-8 h-8 text-red-600' />}
								/>
							</>
						) : (
							<p className='col-span-3 italic text-center'>
								No leaderboard data available
							</p>
						)}
					</div>
				</section>

				{/* Leaderboard Table */}
				<section>
					<div className='flex flex-col items-center justify-center mb-6'>
						<h2
							className='inline-block px-8 py-2 text-2xl font-semibold text-center border-2 rounded-md'
							style={{ borderColor: COLORS.primary, color: COLORS.primary }}
						>
							Monthly Leaderboard
						</h2>
						<p
							className='mt-1 text-sm select-none'
							style={{ color: COLORS.accent }}
						>
							{timeLeft}
						</p>
					</div>

					{isLoading ? (
						<div className='flex items-center justify-center h-52'>
							<Loader2
								className='w-10 h-10 animate-spin'
								style={{ color: COLORS.primary }}
							/>
						</div>
					) : (
						<LeaderboardTable period='monthly' data={leaderboard} />
					)}
				</section>
			</main>

			<Footer />
		</div>
	);
}

interface RewardCardProps {
	position: string;
	reward: string;
	player?: LeaderboardPlayer;
	icon?: React.ReactNode;
}

function RewardCard({ position, reward, player, icon }: RewardCardProps) {
	return (
		<div
			className='flex flex-col h-full overflow-hidden border shadow-lg rounded-xl'
			style={{
				borderColor: COLORS.primary,
				background: "#1a1a1a",
				color: COLORS.light,
			}}
		>
			<div
				className='h-2 bg-gradient-to-r'
				style={{
					background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.accent})`,
				}}
			/>
			<div className='flex flex-col items-center flex-grow p-6 text-center'>
				<div className='mb-5'>{icon}</div>
				<h3
					className='mb-3 text-xl font-bold tracking-wide'
					style={{ color: COLORS.primary }}
				>
					{position}
				</h3>

				{player ? (
					<>
						<p className='text-lg font-semibold text-white'>
							{player.username}
						</p>
						<p className='text-lg font-medium text-white'>
							${player.wager.toLocaleString()}
						</p>
						<a
							href='https://discord.gg/53rN2TwQv6'
							target='_blank'
							rel='noreferrer'
							className='w-full mt-6'
						>
							<Button className='w-full font-semibold text-white bg-red-700 hover:bg-red-900'>
								Claim Prize
							</Button>
						</a>
					</>
				) : (
					<p className='text-lg font-medium'>{reward}</p>
				)}
			</div>
		</div>
	);
}

export default LeaderboardPage;
