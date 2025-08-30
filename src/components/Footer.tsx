import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { FaKickstarterK, FaTiktok } from "react-icons/fa"; // Kick icon approximation
import { FaInstagram, FaDiscord, FaXTwitter } from "react-icons/fa6"; // Instagram, Discord, X

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='py-6 mt-16 border-t border-[#333] bg-black text-white'>
			<div className='container mx-auto'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
					{/* About */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-white'>
							LeroyyJenderson
						</h3>
						<p className='text-sm text-white/80'>
							Join LeroyyJenderson&apos;s community for exciting gambling
							streams, giveaways, and more. Use affiliate code{" "}
							<span className='font-semibold text-[#E10600]'>Leroyy</span> on
							Rainbet.
						</p>
					</div>

					{/* Links */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-white'>Links</h3>
						<div className='grid grid-cols-2 gap-2'>
							<Link
								to='/'
								className='text-sm text-white/70 transition-colors hover:text-[#E10600]'
							>
								Home
							</Link>
							<Link
								to='/leaderboard'
								className='text-sm text-white/70 transition-colors hover:text-[#E10600]'
							>
								Leaderboard
							</Link>
							<Link
								to='/terms'
								className='text-sm text-white/70 transition-colors hover:text-[#E10600]'
							>
								Terms & Conditions
							</Link>
							<Link
								to='/privacy'
								className='text-sm text-white/70 transition-colors hover:text-[#E10600]'
							>
								Privacy Policy
							</Link>
						</div>
					</div>

					{/* Social */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-white'>Connect</h3>
						<div className='flex gap-3'>
							<a
								href='https://kick.com/LeroyyJenderson'
								target='_blank'
								rel='noreferrer'
								className='flex items-center justify-center transition-colors bg-[#111] rounded-full w-9 h-9 hover:bg-[#E10600] text-white'
							>
								<FaKickstarterK className='w-5 h-5' />
							</a>
							<a
								href='https://x.com/LeroyyJenderson'
								target='_blank'
								rel='noreferrer'
								className='flex items-center justify-center transition-colors bg-[#111] rounded-full w-9 h-9 hover:bg-[#E10600] text-white'
							>
								<FaXTwitter className='w-5 h-5' />
							</a>
							<a
								href='https://discord.gg/53rN2TwQv6'
								target='_blank'
								rel='noreferrer'
								className='flex items-center justify-center transition-colors bg-[#111] rounded-full w-9 h-9 hover:bg-[#E10600] text-white'
							>
								<FaDiscord className='w-5 h-5' />
							</a>

							{/* <a
								href='https://www.tiktok.com/LeroyyJenderson'
								target='_blank'
								rel='noreferrer'
								className='flex items-center justify-center transition-colors bg-[#111] rounded-full w-9 h-9 hover:bg-[#E10600] text-white'
							>
								<FaTiktok className='w-5 h-5' />
							</a> */}
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='pt-4 mt-8 text-sm text-center text-white/70 border-t border-[#333]'>
					<p className='flex flex-wrap items-center justify-center gap-1 text-sm'>
						© {currentYear} LeroyyJenderson. Made with
						<Heart className='w-3 h-3 mx-1 text-[#E10600]' />
						for the community by
						<a
							href='https://www.linkedin.com/in/skander-kefi/'
							target='_blank'
							rel='noreferrer'
							className='font-medium text-white hover:text-[#E10600]'
						>
							Skander
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
