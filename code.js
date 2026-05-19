(function () {
    var width, height, largeHeader, canvas, ctx, points, lines = [], animateHeader = true;

    const MAX_DISTANCE = 130;
    const LINE_SPEED = 0.012;

    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader = document.getElementById("large-header");
        if (!largeHeader) return;
        largeHeader.style.height = height + "px";
        canvas = document.getElementById("demo-canvas");
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");

        points = [];
        for (var n = 0; n < 28; n++) {
            var p = {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.75,
                vy: (Math.random() - 0.5) * 0.75
            };
            points.push(p);
        }

        for (var i in points) {
            var c = new Circle(points[i], 2, "rgba(0,212,255,0.35)");
            points[i].circle = c;
        }
    }

    function addListeners() {
        window.addEventListener("scroll", scrollCheck);
        window.addEventListener("resize", resize);
    }

    // Nav background on scroll
    window.addEventListener('scroll', function () {
        var nav = document.getElementById('main-nav');
        if (nav) {
            if (window.scrollY > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });

    function scrollCheck() {
        animateHeader = window.scrollY <= height;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        if (largeHeader) largeHeader.style.height = height + "px";
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
        }
    }

    function initAnimation() {
        animate();
    }

    function animate() {
        if (animateHeader && ctx) {
            ctx.clearRect(0, 0, width, height);
            for (var i in points) {
                movePoint(points[i]);
            }
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
        if (p.x <= 0 || p.x >= width)  p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;
    }

    function drawLines(p) {
        ctx.strokeStyle = "rgba(0, 212, 255, 0.1)";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 1;

        for (var i in points) {
            var p2 = points[i];
            var distance = getDistance(p, p2);

            if (p !== p2 && distance < MAX_DISTANCE) {
                var lineKey = [p, p2].sort(function (a, b) {
                    return a.x - b.x || a.y - b.y;
                }).join("-");
                var line = lines[lineKey];
                if (!line) {
                    line = { progress: 0 };
                    lines[lineKey] = line;
                }

                if (line.progress < 1) {
                    line.progress += LINE_SPEED;
                }

                var x = p.x + (p2.x - p.x) * line.progress;
                var y = p.y + (p2.y - p.y) * line.progress;

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
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = _this.color;
            ctx.fill();
        };
    }

    function getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
})();

/* ===========================
   SMOOTH SCROLL
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        var targetId = href.substring(1);
        var target = document.getElementById(targetId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 64,
                behavior: 'smooth'
            });
        }
    });
});

/* ===========================
   SCROLL REVEAL
   =========================== */
var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, idx) {
        if (entry.isIntersecting) {
            // Stagger children if it's a grid
            var delay = 0;
            if (entry.target.classList.contains('project-card')) {
                var siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-up'));
                delay = Math.min(siblings.indexOf(entry.target) * 60, 300);
            }
            setTimeout(function () {
                entry.target.classList.add('visible');
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(function (el) {
    revealObserver.observe(el);
});