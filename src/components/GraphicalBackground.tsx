import { useEffect, useRef } from "react";

export function GraphicalBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// 🎨 Dark red / black / white palette
		const colors = [
			"rgba(185, 28, 28,", // deep red
			"rgba(248, 113, 113,", // accent red
			"rgba(255, 255, 255,", // white accents
		];

		interface Particle {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			color: string;
			alpha: number;
		}

		const particles: Particle[] = [];
		const particleCount = 60;

		for (let i = 0; i < particleCount; i++) {
			const color = colors[Math.floor(Math.random() * colors.length)];
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 2 + 1,
				speedX: (Math.random() - 0.5) * 0.3,
				speedY: (Math.random() - 0.5) * 0.3,
				color,
				alpha: Math.random() * 0.3 + 0.1,
			});
		}

		interface FloatingItem {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			rotation: number;
			rotationSpeed: number;
			layer: number;
			opacity: number;
			image: HTMLImageElement;
		}

		// Spartan logo
		const spartanImg = new Image();
		spartanImg.src =
			"https://i.ibb.co/5x447Kf5/spartan-race-logo-png-seeklogo-483730-removebg-preview.png";

		const items: FloatingItem[] = [];
		const itemCount = 25; // fewer but larger logos

		for (let i = 0; i < itemCount; i++) {
			const layer = Math.floor(Math.random() * 3);
			const baseSize = [60, 100, 150][layer];

			items.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: baseSize + Math.random() * 30,
				speedX: (Math.random() - 0.5) * (0.1 + layer * 0.05),
				speedY: (Math.random() - 0.5) * (0.1 + layer * 0.05),
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: (Math.random() - 0.5) * 0.002,
				layer,
				opacity: 0.3 + layer * 0.3,
				image: spartanImg,
			});
		}

		let time = 0;
		let animationFrameId: number;

		const render = () => {
			time += 0.01;

			// Background overlay (black w/ subtle tint)
			ctx.fillStyle = "rgba(17, 17, 17, 0.8)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Particles (small glowing dots)
			particles.forEach((p) => {
				p.x += p.speedX;
				p.y += p.speedY;

				if (p.x > canvas.width) p.x = 0;
				if (p.x < 0) p.x = canvas.width;
				if (p.y > canvas.height) p.y = 0;
				if (p.y < 0) p.y = canvas.height;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `${p.color}${p.alpha})`;
				ctx.fill();
			});

			// Floating Spartan logos
			items.forEach((item, idx) => {
				const layerSpeed = 0.3 + item.layer * 0.2;

				item.x += item.speedX * layerSpeed + Math.sin(time + idx) * 0.3;
				item.y += item.speedY * layerSpeed + Math.cos(time + idx) * 0.3;
				item.rotation += item.rotationSpeed;

				const scale = 0.95 + Math.sin(time + idx) * 0.05;

				// Wrap around screen
				if (item.x > canvas.width) item.x = -item.size;
				if (item.x < -item.size) item.x = canvas.width;
				if (item.y > canvas.height) item.y = -item.size;
				if (item.y < -item.size) item.y = canvas.height;

				// Draw logo
				ctx.save();
				ctx.globalAlpha = item.opacity;
				ctx.shadowColor = "rgba(185,28,28,0.6)"; // red glow
				ctx.shadowBlur = 20;

				ctx.translate(item.x + item.size / 2, item.y + item.size / 2);
				ctx.rotate(item.rotation);
				ctx.scale(scale, scale);
				ctx.drawImage(
					item.image,
					-item.size / 2,
					-item.size / 2,
					item.size,
					item.size
				);
				ctx.restore();
			});

			animationFrameId = requestAnimationFrame(render);
		};

		spartanImg.onload = () => render();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className='fixed top-0 left-0 w-full h-full pointer-events-none -z-10'
		/>
	);
}

export default GraphicalBackground;
