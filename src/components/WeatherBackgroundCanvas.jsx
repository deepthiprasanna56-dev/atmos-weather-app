import { useEffect, useRef } from 'react';

/**
 * WeatherBackgroundCanvas
 * High-performance HTML5 Canvas animation tailored dynamically to current weather condition.
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
      // If motion is reduced, render a static artistic backdrop without loop
      ctx.clearRect(0, 0, width, height);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    // Particle sets based on condition
    let particles = [];
    let clouds = [];
    let lightningTimer = 0;
    let lightningOpacity = 0;
    let shootingStar = null;

    // Initialize particles
    if (particleType === 'rain' || particleType === 'thunder') {
      const count = particleType === 'thunder' ? 120 : 80;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 18 + 12,
          speedY: Math.random() * 9 + 11,
          speedX: -2 - Math.random() * 2,
          opacity: Math.random() * 0.4 + 0.2,
          width: Math.random() * 1.5 + 0.8,
        });
      }
    } else if (particleType === 'snow') {
      const count = 65;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1.2,
          speedY: Math.random() * 1.2 + 0.6,
          speedX: Math.sin(Math.random() * Math.PI) * 0.8,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.02 + 0.01,
          opacity: Math.random() * 0.6 + 0.3,
        });
      }
    } else if (particleType === 'clouds' || particleType === 'fog') {
      const count = particleType === 'fog' ? 6 : 5;
      for (let i = 0; i < count; i++) {
        clouds.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.55),
          radius: Math.random() * 100 + 80,
          speedX: Math.random() * 0.25 + 0.08,
          opacity: particleType === 'fog' ? 0.08 : 0.12,
        });
      }
    } else if (particleType === 'stars') {
      const count = 75;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.7,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    } else {
      // Sunshine particles (warm floating specks)
      const count = 35;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3.5 + 1,
          speedY: -(Math.random() * 0.4 + 0.1),
          speedX: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.35 + 0.1,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // SUNSHINE
      if (particleType === 'sun') {
        // Radiant sun glow in top right
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

        // Warm ambient dust particles
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

      // RAIN OR THUNDER
      else if (particleType === 'rain' || particleType === 'thunder') {
        // Lightning flash
        if (particleType === 'thunder') {
          lightningTimer++;
          if (lightningTimer > 180 && Math.random() < 0.015) {
            lightningOpacity = Math.random() * 0.45 + 0.2;
            lightningTimer = 0;
          }
          if (lightningOpacity > 0) {
            ctx.fillStyle = `rgba(224, 231, 255, ${lightningOpacity})`;
            ctx.fillRect(0, 0, width, height);
            lightningOpacity -= 0.03;
          }
        }

        ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();

        particles.forEach((p) => {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        });
        ctx.stroke();
      }

      // SNOW
      else if (particleType === 'snow') {
        particles.forEach((p) => {
          p.wobble += p.wobbleSpeed;
          p.y += p.speedY;
          p.x += Math.sin(p.wobble) * 0.7;

          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // CLOUDS & FOG
      else if (particleType === 'clouds' || particleType === 'fog') {
        clouds.forEach((c) => {
          c.x += c.speedX;
          if (c.x - c.radius > width) {
            c.x = -c.radius * 2;
            c.y = Math.random() * (height * 0.55);
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

      // STARS & SHOOTING STAR
      else if (particleType === 'stars') {
        particles.forEach((p) => {
          p.twinklePhase += p.twinkleSpeed;
          const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.twinklePhase));

          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Shooting star occasional event
        if (!shootingStar && Math.random() < 0.006) {
          shootingStar = {
            x: Math.random() * width * 0.8,
            y: Math.random() * (height * 0.35),
            length: 80,
            speed: 14,
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
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
