// src/ParticleCanvas.js
import React, { useRef, useEffect } from 'react';

const pastelColors = [
    'rgba(255, 182, 193, 0.8)',  // Light Pink
    'rgba(255, 218, 185, 0.8)',  // Peach Puff
    'rgba(221, 160, 221, 0.8)',  // Plum
    'rgba(176, 224, 230, 0.8)',  // Powder Blue
    'rgba(152, 251, 152, 0.8)',  // Pale Green
    'rgba(240, 230, 140, 0.8)',  // Khaki
];

class Particle {
    constructor(x, y, size, color, shape) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.shape = shape;
        this.weight = Math.random() * 1.5 + 1.5;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        switch (this.shape) {
            case 'circle':
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                break;
            case 'square':
                ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
                break;
            case 'triangle':
                ctx.moveTo(this.x, this.y - this.size);
                ctx.lineTo(this.x + this.size, this.y + this.size);
                ctx.lineTo(this.x - this.size, this.y + this.size);
                ctx.closePath();
                break;
            case 'rhombus':
                ctx.moveTo(this.x, this.y - this.size);
                ctx.lineTo(this.x + this.size, this.y);
                ctx.lineTo(this.x, this.y + this.size);
                ctx.lineTo(this.x - this.size, this.y);
                ctx.closePath();
                break;
            case 'trapezoid':
                ctx.moveTo(this.x - this.size, this.y + this.size);
                ctx.lineTo(this.x + this.size, this.y + this.size);
                ctx.lineTo(this.x + this.size / 2, this.y - this.size);
                ctx.lineTo(this.x - this.size / 2, this.y - this.size);
                ctx.closePath();
                break;
            default:
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                break;
        }
        ctx.fill();
    }

    update(canvas) {
        this.size -= 0.05;
        if (this.size < 0) {
            this.x = Math.random() * (canvas.width - this.size * 20) + this.size;
            this.y = Math.random() * (canvas.height - this.size * 20) + this.size;
            this.size = (Math.random() * 20) + 2;
            this.weight = Math.random() * 1.5 + 1.5;
        }
        this.y += this.weight;
        this.weight += 0.2;
        if (this.y > canvas.height - this.size) {
            this.weight *= -0.8;
        }
    }
}

const ParticleCanvas = () => {
    const canvasRef = useRef(null);
    const particleArray = useRef([]);

    const getRandomColor = () => {
        return pastelColors[Math.floor(Math.random() * pastelColors.length)];
    };

    const getRandomShape = () => {
        const shapes = ['circle', 'square', 'triangle', 'rhombus', 'trapezoid'];
        return shapes[Math.floor(Math.random() * shapes.length)];
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const init = () => {
            particleArray.current = [];
            for (let i = 0; i < 100; i++) {
                let size = (Math.random() * 8) + 20;
                let x = Math.random() * (canvas.width - size * 20) + size;
                let y = Math.random() * (canvas.height - size * 20) + size;
                let color = getRandomColor();
                let shape = getRandomShape();
                particleArray.current.push(new Particle(x, y, size, color, shape));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particleArray.current.forEach(particle => {
                particle.update(canvas);
                particle.draw(ctx);
            });
            requestAnimationFrame(animate);
        };

        init();
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });
    }, []);

    return <canvas style={{ maxWidth: '100%' }} ref={canvasRef} />;
};

export default ParticleCanvas;
