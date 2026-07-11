import { useEffect, useRef } from "react";

interface StarfieldProps {
  mode: "warp" | "drift";
  speedMultiplier?: number;
  interactive?: boolean;
  panOffset?: { x: number; y: number };
}

class Star {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  prevZ: number = 0;
  color: string = "#ffffff";
  twinkleSpeed: number = 0;
  twinklePhase: number = 0;

  constructor(width: number, height: number) {
    this.reset(width, height);
    // Randomize initial depth to distribute stars evenly
    this.z = Math.random() * width;
    this.prevZ = this.z;
    this.twinkleSpeed = 0.01 + Math.random() * 0.04;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  reset(width: number, height: number) {
    this.x = (Math.random() - 0.5) * width * 1.5;
    this.y = (Math.random() - 0.5) * height * 1.5;
    this.z = width;
    this.prevZ = this.z;

    const colors = [
      "#ffffff", // White
      "#bae6fd", // Celestial blue
      "#e0f2fe", // Ice blue
      "#f472b6", // Pink stardust
      "#c084fc", // Purple galaxy
      "#a5f3fc", // Cyan star
      "#fed7aa", // Warm orange star
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(width: number, height: number, speed: number) {
    this.prevZ = this.z;
    this.z -= speed;
    if (this.z <= 0) {
      this.reset(width, height);
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    mode: "warp" | "drift"
  ) {
    const cx = width / 2;
    const cy = height / 2;

    // Prevent divide by zero
    const zVal = this.z <= 0 ? 0.1 : this.z;
    const prevZVal = this.prevZ <= 0 ? 0.1 : this.prevZ;

    // Projected coordinates
    const px = (this.x / zVal) * cx * 0.8 + cx;
    const py = (this.y / zVal) * cy * 0.8 + cy;

    if (px < 0 || px > width || py < 0 || py > height) {
      this.reset(width, height);
      return;
    }

    if (mode === "warp") {
      const ppx = (this.x / prevZVal) * cx * 0.8 + cx;
      const ppy = (this.y / prevZVal) * cy * 0.8 + cy;

      // Draw streak
      ctx.beginPath();
      ctx.moveTo(ppx, ppy);
      ctx.lineTo(px, py);
      ctx.strokeStyle = this.color;
      // Thicker and brighter as they get closer
      ctx.lineWidth = Math.min(3.5, (1 - this.z / width) * 3.5);
      ctx.stroke();
    } else {
      // Gentle drift (circular points with glow and twinkle)
      this.twinklePhase += this.twinkleSpeed;
      const twinkle = Math.sin(this.twinklePhase) * 0.35 + 0.65; // goes between 0.3 and 1.0

      // Increased minimum size to 1.1 and scale factor to 4.8 for much more prominent stars
      const size = Math.max(1.1, (1 - this.z / width) * 4.8) * twinkle;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      
      // Much brighter and bigger glowing effect
      if (size > 1.8) {
        ctx.shadowBlur = 14;
        ctx.shadowColor = this.color;
      } else if (size > 1.2) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
      }
      ctx.fill();

      // Draw beautiful subtle cross flares for extra large stardust stars
      if (size > 2.2) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.65 * twinkle;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        // horizontal line
        ctx.moveTo(px - size * 2.2, py);
        ctx.lineTo(px + size * 2.2, py);
        // vertical line
        ctx.moveTo(px, py - size * 2.2);
        ctx.lineTo(px, py + size * 2.2);
        ctx.stroke();
        ctx.restore();
      }
      
      ctx.shadowBlur = 0; // reset shadow for performance
    }
  }
}

class Comet {
  x: number = 0;
  y: number = 0;
  speed: number = 0;
  angle: number = 0;
  length: number = 0;
  width: number = 0;
  opacity: number = 0;
  active: boolean = false;
  color: string = "";

  spawn(width: number, height: number) {
    this.active = true;
    
    // Spawn from top/right diagonal or top/left diagonal
    const fromLeft = Math.random() > 0.5;
    if (fromLeft) {
      this.x = Math.random() * (width * 0.3);
      this.y = -60;
      this.angle = Math.PI / 6 + Math.random() * (Math.PI / 10); // around 30 to 48 degrees down-right
    } else {
      this.x = width * 0.7 + Math.random() * (width * 0.3);
      this.y = -60;
      this.angle = (Math.PI * 5) / 6 - Math.random() * (Math.PI / 10); // around 132 to 150 degrees down-left
    }
    
    this.speed = 10 + Math.random() * 12;
    this.length = 140 + Math.random() * 180;
    this.width = 1.5 + Math.random() * 2.2;
    this.opacity = 0.7 + Math.random() * 0.3;
    
    const colors = ["#a5f3fc", "#bae6fd", "#f472b6", "#ffffff", "#c084fc", "#3b82f6"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(width: number, height: number) {
    if (!this.active) return;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Check if fully offscreen
    if (this.y > height + this.length || this.x < -this.length || this.x > width + this.length) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    // Draw trail using linear gradient from head to tail
    const tailX = this.x - Math.cos(this.angle) * this.length;
    const tailY = this.y - Math.sin(this.angle) * this.length;

    const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.15, this.color);
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.width;
    ctx.lineCap = "round";
    
    // Comet glowing core
    ctx.shadowBlur = 14;
    ctx.shadowColor = this.color;
    ctx.stroke();

    // Small bright nucleus head
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ffffff";
    ctx.fill();

    ctx.restore();
  }
}

export default function Starfield({
  mode,
  speedMultiplier = 1,
  interactive = true,
  panOffset,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activeSpeedRef = useRef<number>(1);
  const panOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dynamically update the panOffset ref without breaking/retriggering the useEffect loop
  useEffect(() => {
    if (panOffset) {
      panOffsetRef.current = panOffset;
    }
  }, [panOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Much larger star counts to make the sky extremely starry and dense
    const starCount = mode === "warp" ? 480 : 360; 
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star(width, height));
    }

    // Initialize comet list and timer
    const comets: Comet[] = [new Comet(), new Comet(), new Comet(), new Comet()];
    let cometCooldown = 120 + Math.random() * 200; // faster comets

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX - width / 2,
        y: e.clientY - height / 2,
      };
    };

    window.addEventListener("resize", handleResize);
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Main animation loop
    const render = () => {
      if (!canvas || !ctx) return;

      // Determine current target speed
      const targetSpeed = mode === "warp" ? 18 : 0.6;
      
      // Interpolate speed smoothly to prevent jarring cuts
      activeSpeedRef.current += (targetSpeed - activeSpeedRef.current) * 0.08;
      const speed = activeSpeedRef.current * speedMultiplier;

      // Clear or fade background
      if (mode === "warp") {
        ctx.fillStyle = "rgba(3, 3, 3, 0.25)";
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = "#030303";
        ctx.fillRect(0, 0, width, height);

        // Ambient deep space background gradient
        // Parallax shift on mouse and panning
        const shiftX = mouseRef.current.x * 0.1 + panOffsetRef.current.x * 0.15;
        const shiftY = mouseRef.current.y * 0.1 + panOffsetRef.current.y * 0.15;

        const gradient = ctx.createRadialGradient(
          width / 2 + shiftX,
          height / 2 + shiftY,
          10,
          width / 2 + shiftX * 0.5,
          height / 2 + shiftY * 0.5,
          width * 0.85
        );
        gradient.addColorStop(0, "rgba(12, 12, 34, 0.8)");
        gradient.addColorStop(0.35, "rgba(6, 6, 18, 0.6)");
        gradient.addColorStop(0.7, "rgba(3, 3, 8, 0.35)");
        gradient.addColorStop(1, "#030303");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Slightly rotate/shift the entire coordinate system based on mouse and drag-to-pan coordinates to add depth
      if (mode === "drift") {
        ctx.save();
        const pxShift = mouseRef.current.x * 0.03 + panOffsetRef.current.x * 0.22;
        const pyShift = mouseRef.current.y * 0.03 + panOffsetRef.current.y * 0.22;
        ctx.translate(pxShift, pyShift);
      }

      // Update and draw stars
      for (const star of stars) {
        star.update(width, height, speed);
        star.draw(ctx, width, height, mode);
      }

      // Comets system (Only active in normal orbit view, i.e., drift mode)
      if (mode === "drift") {
        cometCooldown--;
        if (cometCooldown <= 0) {
          // Attempt to spawn an inactive comet
          const inactiveComet = comets.find((c) => !c.active);
          if (inactiveComet) {
            inactiveComet.spawn(width, height);
          }
          cometCooldown = 180 + Math.random() * 280; // reset spawn timer
        }

        // Render & update active comets
        for (const comet of comets) {
          if (comet.active) {
            comet.update(width, height);
            comet.draw(ctx);
          }
        }
      }

      if (mode === "drift") {
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationId);
    };
  }, [mode, speedMultiplier, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-black pointer-events-none"
    />
  );
}
