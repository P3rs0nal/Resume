(function () {
  var width,
      height,
      largeHeader,
      canvas,
      ctx,
      points,
      lines = [],
      animateHeader = true;

  const MAX_DISTANCE = 100; // Maximum distance to connect points
  const LINE_SPEED = 0.01;  // Speed of drawing the lines

  // Main
  initHeader();
  initAnimation();
  addListeners();

  function initHeader() {
      width = window.innerWidth;
      height = window.innerHeight;
      largeHeader = document.getElementById("large-header");
      largeHeader.style.height = height + "px";
      canvas = document.getElementById("demo-canvas");
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext("2d");

      // Create points with velocity
      points = [];
      for (var n = 0; n < 20; n++) { // Number of points
          var p = {
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 1.2, // Velocity in X
              vy: (Math.random() - 0.5) * 1.2  // Velocity in Y
          };
          points.push(p);
      }

      // Assign circles to each point
      for (var i in points) {
          var c = new Circle(points[i], 3, "rgba(255,255,255,0.3)");
          points[i].circle = c;
      }
  }

  // Event handling
  function addListeners() {
      window.addEventListener("scroll", scrollCheck);
      window.addEventListener("resize", resize);
  }

  window.addEventListener('scroll', function() {
    const header = document.getElementById('headings');
    const scrollThreshold = 100; // Define the scroll threshold
    if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

  function scrollCheck() {
      animateHeader = document.body.scrollTop <= height;
  }

  function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      largeHeader.style.height = height + "px";
      canvas.width = width;
      canvas.height = height;
  }

  // Animation loop
  function initAnimation() {
      animate();
  }

  function animate() {
      if (animateHeader) {
          ctx.clearRect(0, 0, width, height);

          // Move points and update closest points dynamically
          for (var i in points) {
              movePoint(points[i]);
          }

          // Draw lines and circles
          for (var i in points) {
              drawLines(points[i]);
              points[i].circle.draw();
          }
      }
      requestAnimationFrame(animate);
  }

  function movePoint(p) {
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off the walls
      if (p.x <= 0 || p.x >= width) p.vx *= -1;
      if (p.y <= 0 || p.y >= height) p.vy *= -1;
  }

  function drawLines(p) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.23)";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 1;

      for (var i in points) {
          let p2 = points[i];
          let distance = getDistance(p, p2);

          // Only draw line if within max distance
          if (p !== p2 && distance < MAX_DISTANCE) {

              // Check if line progress exists, if not, initialize
              let lineKey = [p, p2].sort((a, b) => a.x - b.x || a.y - b.y).join("-");
              let line = lines[lineKey];
              if (!line) {
                  line = { progress: 0 };
                  lines[lineKey] = line;
              }

              // Increase progress of the line over time
              if (line.progress < 1) {
                  line.progress += LINE_SPEED;
              }

              // Calculate the position on the line based on progress
              let x = p.x + (p2.x - p.x) * line.progress;
              let y = p.y + (p2.y - p.y) * line.progress;

              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(x, y);
              ctx.stroke();
          }
      }
  }

  function Circle(pos, rad, color) {
      var _this = this;
      (function () {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
      })();

      this.draw = function () {
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = _this.color;
          ctx.fill();
      };
  }

  // Utility function to calculate distance
  function getDistance(p1, p2) {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
})();

// Add smooth scrolling with an offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1); // Get the target ID
      const targetElement = document.getElementById(targetId);

      // Scroll to the target element with an offset
      window.scrollTo({
          top: targetElement.offsetTop - 38,  // Adjust the offset (50px here)
          behavior: 'smooth'  // Smooth scroll
      });
  });
});

gsap.from(".timeline-item", {
  opacity: 0,
  y: 50,
  stagger: 0.2,
  duration: 1
});


