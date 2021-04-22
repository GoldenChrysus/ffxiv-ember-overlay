class AnimateService {
	animateTicker(canvas, duration, reverse) {
		let ctx           = canvas.getContext("2d");
		let canvas_width  = canvas.width;
		let canvas_height = canvas.height;
		let percent       = 100;
		// let increment     = (percent / duration);
		let elapsed       = 0;
		let start         = 0;
		// let next_time     = 0;

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

		/* function animate2(time) {
			let first = (next_time === 0);
			let diff  = (next_time === 0) ? 1 : time - next_time;

			next_time = time;
			
			if (!first) {
				percent -= (increment * diff / 10);
			} 

			draw(percent, reverse);

			if (percent >= 0) {
				requestAnimationFrame(animate2);
			}
		} */

		function draw(percent, reverse) {
			let end_radians = (!reverse) ? (-Math.PI / 2) - Math.PI * 2 * percent / 100 : (-Math.PI / 2) + (Math.PI * 2 * percent / 100);

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