class AnimateService {
	animateTicker(canvas, duration, reverse) {
		const ctx           = canvas.getContext("2d");
		const canvas_width  = canvas.width;
		const canvas_height = canvas.height;
		let percent       = 100;
		let elapsed       = 0;
		let start         = 0;

		requestAnimationFrame(animate);

		function animate(time) {
			if (start === 0) {
				start = time;
			}

			elapsed = time - start;
			percent = 100 - (((elapsed / 1000) / duration) * 100);

			draw(percent, reverse);

			if (percent >= 0) {
				requestAnimationFrame(animate);
			}
		}

		function draw(percent, reverse) {
			const end_radians = (!reverse) ? (-Math.PI / 2) - (Math.PI * 2 * percent / 100) : (-Math.PI / 2) + (Math.PI * 2 * percent / 100);

			ctx.clearRect(0, 0, canvas_width, canvas_height);
			ctx.beginPath();
			ctx.arc(canvas_width / 2, canvas_height / 2, canvas_width * 2, -Math.PI / 2, end_radians, !reverse);
			ctx.lineTo(canvas_width / 2, canvas_height / 2);

			ctx.fillStyle = "rgba(0, 0, 0, 0.7)";

			ctx.fill();
			ctx.closePath();
		}
	}
}

export default new AnimateService();
