import { useEffect, useRef } from 'react';

/**
 * WeatherBackgroundCanvas
 * High-performance HTML5 Canvas animation tailored dynamically to current weather condition.
 * Renders rain, snow, clouds, sunshine, thunderstorm, fog, and stars.
 * Respects reduced-motion preferences.
 */
export default function WeatherBackgroundCanvas({ particleType = 'sun', reducedMotion = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    if (reducedMotion) {
      ctx.clearRect(0, 0, width, height);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    // Particle & effect storage
    let particles = [];
    let clouds = [];
    let splashes = [];
    let lightningTimer = 0;
    let lightningOpacity = 0;
    let shootingStar = null;

    const isMobile = width < 768;

    // Initialize particles based on condition
    if (particleType === 'rain' || particleType === 'thunder') {
      const count = isMobile ? 160 : 280;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * (width + 200) - 100,
          y: Math.random() * height,
          length: Math.random() * 24 + 18,
          speedY: Math.random() * 10 + 18,
          speedX: -2.8 - Math.random() * 2.2,
          opacity: Math.random() * 0.5 + 0.45,
          width: Math.random() * 1.4 + 1.2,
        });
      }
    } else if (particleType === 'snow') {
      const count = isMobile ? 50 : 90;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3.2 + 1.2,
          speedY: Math.random() * 1.4 + 0.8,
          speedX: Math.sin(Math.random() * Math.PI) * 0.8,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.025 + 0.015,
          opacity: Math.random() * 0.6 + 0.35,
        });
      }
    } else if (particleType === 'clouds' || particleType === 'fog') {
      const count = particleType === 'fog' ? 8 : 6;
      for (let i = 0; i < count; i++) {
        clouds.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.6),
          radius: Math.random() * 120 + 90,
          speedX: Math.random() * 0.25 + 0.1,
          opacity: particleType === 'fog' ? 0.09 : 0.14,
        });
      }
    } else if (particleType === 'stars') {
      const count = isMobile ? 50 : 100;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.7,
          radius: Math.random() * 1.6 + 0.6,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    } else {
      // Sunshine particles (warm floating specks)
      const count = isMobile ? 25 : 45;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3.5 + 1.2,
          speedY: -(Math.random() * 0.45 + 0.15),
          speedX: (Math.random() - 0.5) * 0.35,
          opacity: Math.random() * 0.35 + 0.15,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. RAIN OR THUNDER (Vivid, distinct raindrops with ground splashes)
      if (particleType === 'rain' || particleType === 'thunder') {
        // Lightning flash effect
        if (particleType === 'thunder') {
          lightningTimer++;
          if (lightningTimer > 160 && Math.random() < 0.018) {
            lightningOpacity = Math.random() * 0.45 + 0.25;
            lightningTimer = 0;
          }
          if (lightningOpacity > 0) {
            ctx.fillStyle = `rgba(224, 231, 255, ${lightningOpacity})`;
            ctx.fillRect(0, 0, width, height);
            lightningOpacity -= 0.035;
          }
        }

        // Draw and update falling raindrops
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.lineWidth = p.width;
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.opacity})`;
          ctx.lineCap = 'round';

          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;

          // When raindrop hits the ground, create water splash ripple
          if (p.y > height - 30) {
            if (splashes.length < 50 && Math.random() < 0.3) {
              splashes.push({
                x: p.x,
                y: height - Math.random() * 20,
                radius: 1,
                maxRadius: Math.random() * 12 + 6,
                opacity: 0.6,
              });
            }

            p.y = -p.length - Math.random() * 40;
            p.x = Math.random() * (width + 200) - 100;
          }
        });

        // Update and draw ground splash ripples
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i];
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, s.radius * 1.5, s.radius * 0.5, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(186, 230, 253, ${s.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          s.radius += 0.8;
          s.opacity -= 0.03;

          if (s.opacity <= 0 || s.radius >= s.maxRadius) {
            splashes.splice(i, 1);
          }
        }
      }

      // 2. SUNSHINE (Solar flare & golden dust)
      else if (particleType === 'sun') {
        const sunX = width > 768 ? width * 0.82 : width * 0.75;
        const sunY = 120;
        const gradient = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 280);
        gradient.addColorStop(0, 'rgba(255, 230, 140, 0.35)');
        gradient.addColorStop(0.4, 'rgba(253, 186, 116, 0.15)');
        gradient.addColorStop(1, 'rgba(253, 186, 116, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 280, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.pulse += 0.02;

          if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
          ctx.fillStyle = `rgba(254, 240, 138, ${currentOpacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 3. SNOW (Gentle tumbling flakes)
      else if (particleType === 'snow') {
        particles.forEach((p) => {
          p.wobble += p.wobbleSpeed;
          p.y += p.speedY;
          p.x += Math.sin(p.wobble) * 0.9;

          if (p.y > height) {
            p.y = -6;
            p.x = Math.random() * width;
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 4. CLOUDS & FOG (Soft layered atmospheric puffs)
      else if (particleType === 'clouds' || particleType === 'fog') {
        clouds.forEach((c) => {
          c.x += c.speedX;
          if (c.x - c.radius > width) {
            c.x = -c.radius * 2;
            c.y = Math.random() * (height * 0.6);
          }

          const grad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.radius);
          grad.addColorStop(0, `rgba(255, 255, 255, ${c.opacity * 1.5})`);
          grad.addColorStop(0.7, `rgba(255, 255, 255, ${c.opacity})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 5. STARS & SHOOTING STARS (Twinkling starry night)
      else if (particleType === 'stars') {
        particles.forEach((p) => {
          p.twinklePhase += p.twinkleSpeed;
          const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.twinklePhase));

          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        if (!shootingStar && Math.random() < 0.007) {
          shootingStar = {
            x: Math.random() * width * 0.8,
            y: Math.random() * (height * 0.35),
            length: 85,
            speed: 15,
            opacity: 1,
          };
        }

        if (shootingStar) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(shootingStar.x + shootingStar.length, shootingStar.y + shootingStar.length * 0.5);
          ctx.stroke();

          shootingStar.x += shootingStar.speed;
          shootingStar.y += shootingStar.speed * 0.5;
          shootingStar.opacity -= 0.025;

          if (shootingStar.opacity <= 0) {
            shootingStar = null;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleType, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
      aria-hidden="true"
    />
  );
}
