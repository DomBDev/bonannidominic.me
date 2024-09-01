import React, { useEffect, useRef } from 'react';

const frameRate = 30;
const frameDelay = 1000 / frameRate;
const speedFactor = 0.001;

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particlesArray = [];
    const numberOfParticles = 100;
    let mouse = {
      x: null,
      y: null,
      radius: 100,
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (event) => {
      mouse.x = event.x + window.scrollX;
      mouse.y = event.y + window.scrollY;
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor(x, y, isMouse = false) {
        this.x = x !== undefined ? x : Math.random() * canvas.width;
        this.y = y !== undefined ? y : Math.random() * canvas.height;
        this.size = isMouse ? 10 : Math.random() * 5 + 1;
        this.speedX = (Math.random() * 2 - 1) * speedFactor;
        this.speedY = (Math.random() * 2 - 1) * speedFactor;
        this.density = Math.random() * 30 + 1;
        this.color = `rgba(0, 123, 255, ${Math.random() * 0.5 + 0.5})`;
        this.minDistance = Math.random() * 50 + 50;
        this.lifeSpan = Math.random() * 10000 + 10000;
        this.birthTime = Date.now();
        this.lastConnectionTime = Date.now();
        this.isMouse = isMouse;
      }

      update() {
        if (!this.isMouse) {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
          }
          if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
          }

          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = mouse.radius;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;

          if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
          }

          if (Date.now() - this.birthTime > this.lifeSpan) {
            this.respawn();
          }

          if (Date.now() - this.lastConnectionTime > 10000) {
            this.respawn();
          }
        } else {
          this.x = mouse.x + this.size / 2;
          this.y = mouse.y - this.size;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      respawn() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = (Math.random() * 2 - 1) * speedFactor;
        this.speedY = (Math.random() * 2 - 1) * speedFactor;
        this.density = Math.random() * 30 + 1;
        this.color = `rgba(0, 123, 255, ${Math.random() * 0.5 + 0.5})`;
        this.minDistance = Math.random() * 50 + 50;
        this.lifeSpan = Math.random() * 15000 + 10000;
        this.birthTime = Date.now();
        this.lastConnectionTime = Date.now();
      }
    }

    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
      particlesArray.push(new Particle(mouse.x, mouse.y, true));
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      connect(particlesArray);
      animationRef.current = setTimeout(animate, frameDelay);
    }

    function connect(particlesArray) {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            opacityValue = 1 - distance / 100;
            ctx.strokeStyle = `rgba(0, 123, 255, ${opacityValue})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();

            let force = (100 - distance) / 100;
            let forceX = (dx / distance) * force;
            let forceY = (dy / distance) * force;

            if (distance < particlesArray[a].minDistance || distance < particlesArray[b].minDistance) {
              let repelForce = (Math.min(particlesArray[a].minDistance, particlesArray[b].minDistance) - distance) /
                Math.min(particlesArray[a].minDistance, particlesArray[b].minDistance);
              let repelX = (dx / distance) * repelForce;
              let repelY = (dy / distance) * repelForce;

              particlesArray[a].speedX += repelX;
              particlesArray[a].speedY += repelY;
              particlesArray[b].speedX -= repelX;
              particlesArray[b].speedY -= repelY;
            } else {
              particlesArray[a].speedX -= forceX;
              particlesArray[a].speedY -= forceY;
              particlesArray[b].speedX += forceX;
              particlesArray[b].speedY += forceY;
            }

            particlesArray[a].lastConnectionTime = Date.now();
            particlesArray[b].lastConnectionTime = Date.now();
          }
        }
      }
    }

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full z-1" style={{ filter: 'blur(2px)' }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default BackgroundAnimation;
