import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dices, Crown, Users, Gift, User, LogIn, LogOut } from "lucide-react";
import useMediaQuery from "@/hooks/use-media-query";
import { useAuthStore } from "@/store/useAuthStore";

export function Navbar() {
	const location = useLocation();
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [isOpen, setIsOpen] = useState(false);
	const [isLive, setIsLive] = useState(false);
	const [viewerCount, setViewerCount] = useState<number | null>(null);
	const { user, logout } = useAuthStore();

	useEffect(() => {
		setIsOpen(false);
	}, [location, isMobile]);

	useEffect(() => {
		const fetchLiveStatus = async () => {
			try {
				const res = await fetch(
					"https://kick.com/api/v2/channels/leroyyjenderson"
				);
				const data = await res.json();

				if (data.livestream) {
					setIsLive(true);
					setViewerCount(data.livestream.viewer_count);
				} else {
					setIsLive(false);
					setViewerCount(null);
				}
			} catch (err) {
				console.error("Error fetching live status", err);
			}
		};

		fetchLiveStatus();
		const interval = setInterval(fetchLiveStatus, 60000);
		return () => clearInterval(interval);
	}, []);

	const menuItems = [
		{ path: "/", name: "Home", icon: <Dices className='w-5 h-5' /> },
		{
			path: "/leaderboard",
			name: "Leaderboard",
			icon: <Crown className='w-5 h-5' />,
		},
		{
			path: "/guess-balance",
			name: "Guess the Balance",
			icon: <Users className='w-5 h-5' />,
		},
		// Only show manage-guess if user is admin
		...(user?.role === "admin"
			? [
					{
						path: "/manage-guess",
						name: "manageguess",
						icon: <Gift className='w-5 h-5' />,
					},
			  ]
			: []),
	];

	return (
		<nav className='sticky top-0 z-50 border-b bg-black/70 backdrop-blur-xl border-red-900/40'>
			<div className='container flex items-center justify-between px-6 py-4 mx-auto'>
				{/* Logo */}
				<Link to='/' className='flex items-center space-x-3 select-none'>
					<img
						src='https://i.ibb.co/QvQJwTGz/Capture-d-cran-2025-08-29-211253.png'
						alt='Logo'
						className='object-cover border-2 border-red-600 rounded-full shadow-lg w-11 h-11'
					/>
					<span className='text-2xl font-extrabold tracking-wide text-white'>
						<span className='text-red-500'>Leroyy</span>
						<span className='text-red-300'>Jenderson</span>
					</span>
				</Link>

				{/* Desktop Menu */}
				{!isMobile && (
					<div className='flex items-center space-x-8'>
						<ul className='flex space-x-6 font-semibold text-white'>
							{menuItems.map((item) => (
								<li key={item.path}>
									<Link
										to={item.path}
										className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
											location.pathname === item.path
												? "bg-gradient-to-r from-red-700 to-red-900 text-white shadow-lg"
												: "hover:bg-gradient-to-r hover:from-red-800 hover:to-red-950 hover:text-white/90"
										}`}
									>
										{item.icon}
										<span>{item.name}</span>
									</Link>
								</li>
							))}
						</ul>

						{/* User / Login/Signup */}
						<div className='flex items-center space-x-5'>
							{user ? (
								<>
									<Link
										to='/profile'
										className='flex items-center space-x-2 font-semibold text-white transition hover:text-red-400'
									>
										<User className='w-5 h-5' />
										<span>{user.username}</span>
									</Link>
									<button
										onClick={logout}
										className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-800 shadow-md hover:from-red-700 hover:to-black text-white font-semibold transition'
									>
										<LogOut className='w-5 h-5' />
										Logout
									</button>
								</>
							) : (
								<>
									<Link
										to='/login'
										className='flex items-center space-x-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-1.5 rounded-lg font-semibold transition'
									>
										<LogIn className='w-5 h-5' /> Login
									</Link>
									<Link
										to='/signup'
										className='font-semibold text-white transition hover:text-red-400'
									>
										Sign Up
									</Link>
								</>
							)}
						</div>
					</div>
				)}

				{/* Live Status */}
				<div
					className={`ml-6 px-4 py-1.5 rounded-full text-sm font-bold select-none shadow-md ${
						isLive
							? "bg-red-600 text-white animate-pulse"
							: "bg-gray-800 text-white/70"
					}`}
					title={isLive ? "Currently Live" : "Offline"}
				>
					{isLive ? (
						<>🔴 LIVE {viewerCount !== null ? `(${viewerCount})` : ""}</>
					) : (
						"Offline"
					)}
				</div>

				{/* Mobile Hamburger */}
				{isMobile && (
					<button
						onClick={() => setIsOpen(!isOpen)}
						aria-label='Toggle menu'
						className='relative z-50 flex flex-col justify-center items-center gap-1.5 w-9 h-9'
					>
						<span
							className={`block w-8 h-1 bg-white rounded transition-transform duration-300 ${
								isOpen ? "rotate-45 translate-y-2 bg-red-500" : ""
							}`}
						/>
						<span
							className={`block w-8 h-1 bg-white rounded transition-opacity duration-300 ${
								isOpen ? "opacity-0" : "opacity-100"
							}`}
						/>
						<span
							className={`block w-8 h-1 bg-white rounded transition-transform duration-300 ${
								isOpen ? "-rotate-45 -translate-y-2 bg-red-500" : ""
							}`}
						/>
					</button>
				)}
			</div>

			{/* Mobile Drawer */}
			{isMobile && (
				<div
					className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
						isOpen
							? "opacity-100 pointer-events-auto"
							: "opacity-0 pointer-events-none"
					}`}
					onClick={() => setIsOpen(false)}
				>
					<div
						className={`absolute top-0 right-0 w-72 bg-zinc-900 h-full shadow-2xl py-8 px-6 flex flex-col space-y-6 transform transition-transform duration-300 ${
							isOpen ? "translate-x-0" : "translate-x-full"
						}`}
						onClick={(e) => e.stopPropagation()}
					>
						<ul className='flex flex-col space-y-5 font-semibold text-white'>
							{menuItems.map((item) => (
								<li key={item.path}>
									<Link
										to={item.path}
										onClick={() => setIsOpen(false)}
										className={`flex items-center gap-3 text-lg px-3 py-2 rounded-lg transition-all ${
											location.pathname === item.path
												? "bg-gradient-to-r from-red-600 to-red-800 shadow-md"
												: "hover:bg-gradient-to-r hover:from-red-700 hover:to-red-900"
										}`}
									>
										{item.icon}
										<span>{item.name}</span>
									</Link>
								</li>
							))}
						</ul>

						<div className='mt-auto space-y-4'>
							{user ? (
								<>
									<Link
										to='/profile'
										onClick={() => setIsOpen(false)}
										className='flex items-center gap-3 text-lg font-semibold text-white transition hover:text-red-400'
									>
										<User className='w-6 h-6' />
										<span>{user.username}</span>
									</Link>
									<button
										onClick={() => {
											logout();
											setIsOpen(false);
										}}
										className='w-full py-2 font-semibold text-white transition rounded-lg shadow-md bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-black'
									>
										<LogOut className='inline w-5 h-5 mr-2' />
										Logout
									</button>
								</>
							) : (
								<>
									<Link
										to='/login'
										onClick={() => setIsOpen(false)}
										className='flex items-center px-4 py-2 space-x-2 font-semibold text-red-600 transition border border-red-600 rounded-lg hover:bg-red-600 hover:text-white'
									>
										<LogIn className='w-5 h-5' /> Login
									</Link>
									<Link
										to='/signup'
										onClick={() => setIsOpen(false)}
										className='font-semibold text-white transition hover:text-red-400'
									>
										Sign Up
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
