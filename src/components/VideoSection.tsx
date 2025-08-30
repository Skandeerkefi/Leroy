import { useEffect, useState } from "react";

const API_KEY = "AN0rUS9NnxW8N7nij3tuwr6DLosBYtNCNKE3HrgP5gc"; // Sandbox Key
const API_URL = "https://sandbox.api.video/videos";

export default function VideoSection() {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchVideos() {
			try {
				const res = await fetch(API_URL, {
					headers: {
						Authorization: `Bearer ${API_KEY}`,
					},
				});
				const data = await res.json();
				setVideos(data.data || []);
			} catch (err) {
				console.error("Failed to fetch videos:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchVideos();
	}, []);

	if (loading)
		return <p className='text-center text-red-400'>Loading videos...</p>;
	if (!videos.length)
		return <p className='text-center text-red-400'>No videos available.</p>;

	return (
		<section className='container px-6 mx-auto my-20'>
			<h2 className='mb-8 text-3xl font-bold text-center text-red-500'>
				🎬 Clips
			</h2>
			<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
				{videos.map((video) => (
					<div
						key={video.videoId}
						className='overflow-hidden border border-red-600 shadow-lg bg-gray-900/70 rounded-2xl'
					>
						<video
							controls
							className='w-full aspect-video'
							src={video.assets.mp4 || video.assets.hls}
						/>
						<div className='p-4'>
							<h3 className='text-lg font-bold text-red-400'>
								{video.title || "Untitled"}
							</h3>
							<p className='text-sm text-gray-300'>{video.description || ""}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
