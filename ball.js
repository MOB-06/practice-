import { useState, useEffect, useRef } from 'react';

export default function MovingBall() {
    const [position, setPosition] = useState({ x: 200, y: 150 });
    const [velocity, setVelocity] = useState({ x: 4, y: 3 });
    const [isRunning, setIsRunning] = useState(true);
    const [ballColor, setBallColor] = useState('#3b82f6');
    const [ballSize, setBallSize] = useState(50);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isRunning) return;

        const animate = () => {
            setPosition(prev => {
                const container = containerRef.current;
                if (!container) return prev;

                const maxX = container.clientWidth - ballSize;
                const maxY = container.clientHeight - ballSize;

                let newX = prev.x + velocity.x;
                let newY = prev.y + velocity.y;
                let newVelX = velocity.x;
                let newVelY = velocity.y;

                // Bounce off walls
                if (newX <= 0 || newX >= maxX) {
                    newVelX = -velocity.x;
                    newX = newX <= 0 ? 0 : maxX;
                }
                if (newY <= 0 || newY >= maxY) {
                    newVelY = -velocity.y;
                    newY = newY <= 0 ? 0 : maxY;
                }

                if (newVelX !== velocity.x || newVelY !== velocity.y) {
                    setVelocity({ x: newVelX, y: newVelY });
                }

                return { x: newX, y: newY };
            });
        };

        const intervalId = setInterval(animate, 16);
        return () => clearInterval(intervalId);
    }, [isRunning, velocity, ballSize]);

    const handleSpeedChange = (multiplier) => {
        setVelocity(prev => ({
            x: prev.x * multiplier,
            y: prev.y * multiplier
        }));
    };

    const randomizeDirection = () => {
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
        const angle = Math.random() * Math.PI * 2;
        setVelocity({
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        });
    };

    const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];

    return (
        <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">🎾 Bouncing Ball Demo</h1>
            
            {/* Controls */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                    {isRunning ? '⏸ Pause' : '▶ Play'}
                </button>
                <button
                    onClick={() => handleSpeedChange(1.5)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                    ⚡ Faster
                </button>
                <button
                    onClick={() => handleSpeedChange(0.7)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                >
                    🐌 Slower
                </button>
                <button
                    onClick={randomizeDirection}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                    🔀 Random Direction
                </button>
            </div>

            {/* Color Selection */}
            <div className="flex gap-2 mb-4">
                <span className="text-white mr-2">Colors:</span>
                {colors.map(color => (
                    <button
                        key={color}
                        onClick={() => setBallColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                            ballColor === color ? 'border-white scale-110' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>

            {/* Size Slider */}
            <div className="flex items-center gap-3 mb-4 bg-gray-800 px-4 py-2 rounded-lg">
                <span className="text-white">Size:</span>
                <input
                    type="range"
                    min="20"
                    max="100"
                    value={ballSize}
                    onChange={(e) => setBallSize(Number(e.target.value))}
                    className="w-32"
                />
                <span className="text-white font-mono">{ballSize}px</span>
            </div>

            {/* Ball Container */}
            <div
                ref={containerRef}
                className="relative w-full max-w-2xl h-96 bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl"
            >
                {/* Ball */}
                <div
                    className="absolute rounded-full shadow-lg transition-all duration-75"
                    style={{
                        width: ballSize,
                        height: ballSize,
                        backgroundColor: ballColor,
                        left: position.x,
                        top: position.y,
                        boxShadow: `0 0 20px ${ballColor}80, inset -5px -5px 15px rgba(0,0,0,0.3), inset 5px 5px 15px rgba(255,255,255,0.2)`,
                    }}
                />

                {/* Trail effect */}
                <div
                    className="absolute rounded-full opacity-30 transition-all duration-100"
                    style={{
                        width: ballSize,
                        height: ballSize,
                        backgroundColor: ballColor,
                        left: position.x - velocity.x * 2,
                        top: position.y - velocity.y * 2,
                    }}
                />
                <div
                    className="absolute rounded-full opacity-15 transition-all duration-150"
                    style={{
                        width: ballSize,
                        height: ballSize,
                        backgroundColor: ballColor,
                        left: position.x - velocity.x * 4,
                        top: position.y - velocity.y * 4,
                    }}
                />
            </div>

            {/* Info */}
            <div className="mt-4 bg-gray-800 px-6 py-3 rounded-lg">
                <div className="flex gap-6 text-gray-300 text-sm font-mono">
                    <div>
                        <span className="text-gray-500">Position:</span> ({Math.round(position.x)}, {Math.round(position.y)})
                    </div>
                    <div>
                        <span className="text-gray-500">Velocity:</span> ({velocity.x.toFixed(1)}, {velocity.y.toFixed(1)})
                    </div>
                </div>
            </div>
        </div>
    );
}