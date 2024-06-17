import React, { useRef, useEffect } from 'react';

const RenderImage = () => {
    const canvas1Ref = useRef(null);
    const canvas2Ref = useRef(null);

    useEffect(() => {
        const canvas1 = canvas1Ref.current;
        const ctx1 = canvas1.getContext("2d");
        canvas1.width = window.innerWidth;
        canvas1.height = window.innerHeight;

        const canvas2 = canvas2Ref.current;
        const ctx2 = canvas2.getContext("2d");
        canvas2.width = window.innerWidth;
        canvas2.height = window.innerHeight;

        let particleArray = [];

        class Particle {
            constructor(x, y, size, color) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;
                this.weight = Math.random() * 1.5 + 1.5;
            }
            draw() {
                ctx1.beginPath();
                ctx1.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx1.fillStyle = this.color;
                ctx1.fill();
                ctx1.closePath();
            }
            update() {
                this.size -= 0.05;
                if (this.size < 0) {
                    this.x = Math.random() * (window.innerWidth - this.size * 2) + this.size;
                    this.y = Math.random() * (window.innerHeight - this.size * 2) + this.size;
                    this.size = (Math.random() * 10) + 2;
                    this.weight = Math.random() * 1.5 + 1.5;
                }
                this.y += this.weight;
                this.weight += 0.2;

                if (this.y > canvas1.height - this.size) {
                    this.weight *= -0.8;
                }
            }
        }

        const init = () => {
            particleArray = [];
            for (let i = 0; i < 100; i++) {
                let size = (Math.random() * 5) + 2;
                let x = Math.random() * (window.innerWidth - size * 2) + size;
                let y = Math.random() * (window.innerHeight - size * 2) + size;
                let color = 'black';
                particleArray.push(new Particle(x, y, size, color));
            }
        };

        function connect() {
            for (let a = 0; a < particleArray.length; a++) {
                for (let b = a; b < particleArray.length; b++) {
                    let dx = particleArray[a].x - particleArray[b].x;
                    let dy = particleArray[a].y - particleArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx2.beginPath();
                        ctx2.strokeStyle = 'rgba(255,25,225, 0.8)';
                        ctx2.lineWidth = 0.8;
                        ctx2.moveTo(particleArray[a].x, particleArray[a].y);
                        ctx2.lineTo(particleArray[b].x, particleArray[b].y);
                        ctx2.stroke();
                    }
                }
            }
        }

        const animate = () => {
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
            for (let i = 0; i < particleArray.length; i++) {
                particleArray[i].update();
                particleArray[i].draw();
            }
            connect();
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', () => {
            canvas1.width = window.innerWidth;
            canvas1.height = window.innerHeight;
            canvas2.width = window.innerWidth;
            canvas2.height = window.innerHeight;
            init();
        });

        init();
        animate();
    }, []);

    // Estilos para los canvas
    const canvasStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: -1, // Ajusta según sea necesario
        opacity: 1,
    };

    return (
        <>
            <canvas ref={canvas1Ref} id="canvas1" style={canvasStyle}></canvas>
            <canvas ref={canvas2Ref} id="canvas2" style={{ ...canvasStyle, zIndex: -2 }}></canvas>
        </>
    );
};

export default RenderImage;

