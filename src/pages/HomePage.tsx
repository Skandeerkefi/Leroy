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
				<section className='container flex flex-col-reverse items-center gap-12 px-6 py-20 mx-auto md:flex-row'>
					<div className='text-center md:w-1/2 md:text-left'>
						<h1 className='mb-6 text-5xl font-extrabold tracking-tight text-transparent md:text-6xl bg-gradient-to-r from-red-700 via-red-500 to-red-700 bg-clip-text'>
							LeroyyJenderson
							<br />
							Official Kick Stream
						</h1>
						<p className='mb-8 text-lg text-gray-300'>
							Daily{" "}
							<span className='font-semibold text-red-400'>
								gambling thrills
							</span>{" "}
							and giveaways. Join the excitement live!
						</p>
						<Button
							size='lg'
							className='px-8 py-4 font-bold transition-transform bg-red-600 rounded-full shadow-lg hover:bg-red-700 hover:scale-105'
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
					<div className='overflow-hidden border-4 border-red-600 shadow-2xl md:w-1/2 aspect-video rounded-3xl'>
						<iframe
							src='https://player.kick.com/LeroyyJenderson'
							frameBorder='0'
							allowFullScreen
							title='LeroyyJenderson Live Stream'
							className='w-full h-full'
						/>
					</div>
				</section>

				{/* LEADERBOARD PRIZES */}
				<section className='container mx-auto my-16 text-center'>
					<h2 className='flex items-center justify-center gap-2 mb-6 text-3xl font-bold text-red-500'>
						<Gift className='w-6 h-6 text-red-500' /> Monthly $600 Leaderboard
					</h2>
					<div className='flex flex-wrap justify-center gap-6'>
						<div className='p-6 border border-red-600 shadow-lg w-60 bg-gray-900/70 rounded-2xl'>
							<h3 className='text-xl font-bold text-red-400'>1st Place</h3>
							<p className='text-gray-300'>$400</p>
						</div>
						<div className='p-6 border border-red-600 shadow-lg w-60 bg-gray-900/70 rounded-2xl'>
							<h3 className='text-xl font-bold text-red-400'>2nd Place</h3>
							<p className='text-gray-300'>$150</p>
						</div>
						<div className='p-6 border border-red-600 shadow-lg w-60 bg-gray-900/70 rounded-2xl'>
							<h3 className='text-xl font-bold text-red-400'>3rd Place</h3>
							<p className='text-gray-300'>$50</p>
						</div>
					</div>
				</section>

				{/* COUNTDOWN */}
				<section className='container mx-auto my-16 text-center'>
					<h2 className='mb-6 text-3xl font-bold text-red-500'>
						⏳ Monthly Countdown
					</h2>
					<div className='inline-flex justify-center gap-5 px-12 py-6 font-mono text-3xl border border-red-600 shadow-md bg-gray-900/60 rounded-3xl'>
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
				<section className='container px-6 mx-auto my-20'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='flex items-center gap-2 text-2xl font-bold'>
							<Crown className='w-6 h-6 text-red-500' /> Top Players
						</h2>
						<Button
							variant='outline'
							size='sm'
							className='text-white border-red-500 hover:bg-red-600'
							asChild
						>
							<Link to='/leaderboard' className='flex items-center gap-1'>
								View All <ArrowRight className='w-4 h-4' />
							</Link>
						</Button>
					</div>
					<LeaderboardTable period='monthly' data={topLeaderboard} />
				</section>
				{/* === CLIPS SECTION === */}
				<section className='container px-6 mx-auto my-20'>
					<h2 className='flex items-center justify-center gap-2 mb-8 text-3xl font-bold text-center text-red-500'>
						<Play className='text-red-500 w-7 h-7' /> Latest Clips
					</h2>
					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
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
				{/* STREAM SCHEDULE */}
				<section className='container px-6 mx-auto my-20'>
					<h2 className='mb-8 text-3xl font-bold text-center text-red-500'>
						📅 Stream Schedule
					</h2>
					<div className='grid justify-center grid-cols-2 gap-6 md:grid-cols-4'>
						{["Thu", "Fri", "Sat", "Sun"].map((day) => (
							<div
								key={day}
								className='flex flex-col items-center p-6 transition-transform border border-red-600 shadow bg-gray-900/50 rounded-2xl hover:scale-105'
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
