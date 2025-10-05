import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Link } from "react-router-dom";
import { Crown, ArrowRight, Calendar, Gift, Play } from "lucide-react";
import { useLeaderboardStore } from "@/store/useLeaderboardStore";
import GraphicalBackground from "@/components/GraphicalBackground";

// Dark Red / Black / White Theme
const COLORS = {
  primary: "#b91c1c", // dark red
  accent: "#f87171", // lighter red
  dark: "#0a0a0a", // background
  card: "#111111", // card background
  light: "#fafafa", // text
};

function HomePage() {
	const { leaderboard, fetchLeaderboard } = useLeaderboardStore();
	const topLeaderboard = Array.isArray(leaderboard)
		? leaderboard.slice(0, 5)
		: [];

	// Countdown state
	const [timeLeft, setTimeLeft] = useState("00:00:00:00");
	// 🎥 YOUTUBE CLIPS
	const [clips, setClips] = useState<any[]>([]);
	useEffect(() => {
		if (!leaderboard || leaderboard.length === 0) fetchLeaderboard();

		const updateCountdown = () => {
			const now = new Date();
			const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
			nextMonth.setHours(0, 0, 0, 0);

			const diff = nextMonth.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeLeft("00:00:00:00");
				return;
			}

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);

			setTimeLeft(
				`${days.toString().padStart(2, "0")}:${hours
					.toString()
					.padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
					.toString()
					.padStart(2, "0")}`
			);
		};

		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);

		return () => clearInterval(interval);
	}, [leaderboard, fetchLeaderboard]);
	// 🎥 Fetch Last 4 YouTube Clips
	useEffect(() => {
		const fetchClips = async () => {
			try {
				const res = await fetch(
					`https://www.googleapis.com/youtube/v3/search?key=AIzaSyDWauiPq7gD_4DshUhGaebJKXtzZDLKcBs&channelId=UCKfcuan3y_mUaszxyUMAzNQ&part=snippet,id&order=date&maxResults=4`
				);
				const data = await res.json();
				const vids =
					data.items?.filter((item: any) => item.id.kind === "youtube#video") ||
					[];
				setClips(vids);
			} catch (error) {
				console.error("Error fetching YouTube videos", error);
			}
		};
		fetchClips();
	}, []);

	return (
		<div className='relative flex flex-col min-h-screen text-white bg-black'>
			<GraphicalBackground />
			<Navbar />

			<main className='relative z-10 flex-grow'>
				{/* HERO */}
				<section className='container flex flex-col items-center gap-8 px-4 py-12 mx-auto md:flex-row md:gap-12 md:py-20'>
					<div className='text-center md:w-1/2 md:text-left'>
						<h1 className='mb-4 text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl bg-gradient-to-r from-red-700 via-red-500 to-red-700 bg-clip-text'>
							LeroyyJenderson
							<br /> Official Kick Stream
						</h1>
						<p className='mb-6 text-base text-gray-300 sm:text-lg'>
							Daily{" "}
							<span className='font-semibold text-red-400'>
								gambling thrills
							</span>{" "}
							and giveaways. Join the excitement live!
						</p>
						<Button
							size='lg'
							className='px-6 py-3 font-bold transition-transform bg-red-600 rounded-full shadow-lg hover:bg-red-700 hover:scale-105'
							asChild
						>
							<a
								href='https://kick.com/LeroyyJenderson'
								target='_blank'
								rel='noreferrer'
							>
								🎥 Watch Live
							</a>
						</Button>
					</div>
					{/* Stream first on mobile */}
					<div className='w-full overflow-hidden border-2 border-red-600 shadow-xl aspect-video rounded-2xl md:w-1/2'>
						<iframe
							src='https://player.kick.com/LeroyyJenderson'
							frameBorder='0'
							allowFullScreen
							title='LeroyyJenderson Live Stream'
							className='w-full h-full'
						/>
					</div>
				</section>
				{/* CLIPS SECTION */}
				<section className='container px-4 mx-auto my-16'>
					<h2 className='flex items-center justify-center gap-2 mb-8 text-2xl font-bold text-center text-red-500 sm:text-3xl'>
						<Play className='w-6 h-6 text-red-500 sm:w-7 sm:h-7' /> Latest Clips
					</h2>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
						{clips.map((clip) => (
							<div
								key={clip.id.videoId}
								className='overflow-hidden border border-red-600 shadow-lg rounded-2xl bg-gray-900/60'
							>
								<iframe
									src={`https://www.youtube.com/embed/${clip.id.videoId}`}
									title={clip.snippet.title}
									allowFullScreen
									className='w-full aspect-video'
								/>
								<div className='p-3'>
									<h3 className='text-sm font-semibold text-red-400 line-clamp-2'>
										{clip.snippet.title}
									</h3>
								</div>
							</div>
						))}
					</div>
				</section>
				{/* LEADERBOARD PRIZES */}
				<section className='container px-4 mx-auto my-12 text-center'>
					<h2 className='flex items-center justify-center gap-2 mb-6 text-2xl font-bold text-red-500 sm:text-3xl'>
						<Gift className='w-6 h-6 text-red-500' /> Monthly $600 Leaderboard
					</h2>
					<div className='flex flex-wrap justify-center gap-4 sm:gap-6'>
						{[
							{ place: "1st Place", prize: "$400" },
							{ place: "2nd Place", prize: "$150" },
							{ place: "3rd Place", prize: "$50" },
						].map((item) => (
							<div
								key={item.place}
								className='p-4 w-full max-w-[14rem] border border-red-600 shadow-lg bg-gray-900/70 rounded-2xl sm:p-6'
							>
								<h3 className='text-lg font-bold text-red-400 sm:text-xl'>
									{item.place}
								</h3>
								<p className='text-gray-300'>{item.prize}</p>
							</div>
						))}
					</div>
				</section>

				{/* COUNTDOWN */}
				<section className='container px-4 mx-auto my-12 text-center'>
					<h2 className='mb-6 text-2xl font-bold text-red-500 sm:text-3xl'>
						⏳ Monthly Countdown
					</h2>
					<div className='inline-flex justify-center gap-3 px-6 py-4 font-mono text-2xl border border-red-600 shadow-md bg-gray-900/60 rounded-2xl sm:gap-5 sm:text-3xl sm:px-12 sm:py-6'>
						{timeLeft.split(":").map((val, i) => (
							<div key={i} className='flex flex-col items-center'>
								<span className='font-bold text-red-400'>{val}</span>
								<span className='mt-1 text-xs text-gray-400'>
									{["D", "H", "M", "S"][i]}
								</span>
							</div>
						))}
					</div>
				</section>

				{/* LEADERBOARD TABLE */}
				<section className='container px-4 mx-auto my-16'>
					<div className='flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between'>
						<h2 className='flex items-center gap-2 text-xl font-bold sm:text-2xl'>
							<Crown className='w-6 h-6 text-red-500' /> Top Players
						</h2>
						<Button
							variant='outline'
							size='sm'
							className='self-start text-white border-red-500 hover:bg-red-600 sm:self-auto'
							asChild
						>
							<Link to='/leaderboard' className='flex items-center gap-1'>
								View All <ArrowRight className='w-4 h-4' />
							</Link>
						</Button>
					</div>
					<div className='overflow-x-auto'>
						<LeaderboardTable period='monthly' data={topLeaderboard} />
					</div>
				</section>

				{/* STREAM SCHEDULE */}
				<section className='container px-4 mx-auto my-16'>
					<h2 className='mb-8 text-2xl font-bold text-center text-red-500 sm:text-3xl'>
						📅 Stream Schedule
					</h2>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'>
						{["Thu", "Fri", "Sat", "Sun"].map((day) => (
							<div
								key={day}
								className='flex flex-col items-center p-4 transition-transform border border-red-600 shadow bg-gray-900/50 rounded-2xl hover:scale-105 sm:p-6'
							>
								<Calendar className='w-6 h-6 mb-2 text-red-500' />
								<p className='font-semibold text-red-300'>{day}</p>
								<p className='text-sm text-gray-300'>8:30pm CST</p>
							</div>
						))}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}

export default HomePage;
