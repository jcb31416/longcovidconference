"use client";

import { useMemo }                     from "react";
import seedrandom                      from "seedrandom";

function Virusbglayer() {
    const viruses                      = useMemo(() => {
        const fun_rng                  = seedrandom("lcdd-virus-seed");

        return Array.from({ length:120 }, (_, i) => {
            const depth                = fun_rng() * 0.9 + 0.2;
            const size                 = 10 + depth * 28;
            const left                 = fun_rng() * 100;
            const top                  = fun_rng() * 100;
            const duration             = 18 + fun_rng() * 28;
            const delay                = -fun_rng() * 40;
            const driftX               = 8 + fun_rng() * 26;
            const driftY               = 2 + fun_rng() * 10;
            const blur                 = (1.4 - depth) * 2.2;
            const opacity              = 0.22 + depth * 0.42;
            const stroke               = 0.9 + depth * 1.6;
            const spikes               = 10 + (i % 4);

            return {
                id                     : i,
                depth,
                size,
                left,
                top,
                duration,
                delay,
                driftX,
                driftY,
                blur,
                opacity,
                stroke,
                spikes,
            };
        });
    }, []);

    const str_purple                   = "#3a2047";

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <style>{`
                @keyframes virusDrift {
                  0% {
                    transform: translate3d(calc(var(--drift-x) * -1), calc(var(--drift-y) * -1), 0);
                  }
                  25% {
                    transform: translate3d(calc(var(--drift-x) * 0.35), calc(var(--drift-y) * 0.25), 0);
                  }
                  50% {
                    transform: translate3d(var(--drift-x), var(--drift-y), 0);
                  }
                  75% {
                    transform: translate3d(calc(var(--drift-x) * -0.25), calc(var(--drift-y) * 0.4), 0);
                  }
                  100% {
                    transform: translate3d(calc(var(--drift-x) * -1), calc(var(--drift-y) * -1), 0);
                  }
                }

                @keyframes virusSpin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }

                .virus-wrap {
                  position: absolute;
                  transform: translate(-50%, -50%);
                }

                .virus-drift {
                  will-change: transform;
                  animation: virusDrift var(--duration) ease-in-out infinite;
                  animation-delay: var(--delay);
                  transform-origin: center;
                }

                .virus-svg {
                  display: block;
                  overflow: visible;
                  animation: virusSpin calc(var(--duration) * 2.2) linear infinite;
                  animation-delay: var(--delay);
                  filter: blur(var(--blur));
                  opacity: var(--opacity);
                }
            `}</style>

            {viruses.map((v) => {
                const spokes           = Array.from({ length:v.spikes }, (_, idx) => {
                    const angle        = (Math.PI * 2 * idx) / v.spikes;
                    const r            = 18;
                    const spikeLen     = 8;
                    const x1           = 32 + Math.cos(angle) * r;
                    const y1           = 32 + Math.sin(angle) * r;
                    const x2           = 32 + Math.cos(angle) * (r + spikeLen);
                    const y2           = 32 + Math.sin(angle) * (r + spikeLen);

                    return { x1, y1, x2, y2, idx };
                });

                return (
                    <div
                        key={v.id}
                        className="virus-wrap"
                        style={{
                            left        : `${v.left}%`,
                            top         : `${v.top}%`,
                        }}
                    >
                        <div
                            className="virus-drift"
                            style={{
                                ["--duration"] : `${v.duration}s`,
                                ["--delay"]    : `${v.delay}s`,
                                ["--drift-x"]  : `${v.driftX}px`,
                                ["--drift-y"]  : `${v.driftY}px`,
                                ["--blur"]     : `${v.blur}px`,
                                ["--opacity"]  : v.opacity,
                                transform      : `scale(${v.depth})`,
                            }}
                        >
                            <svg
                                className="virus-svg"
                                width={v.size}
                                height={v.size}
                                viewBox="0 0 64 64"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                {spokes.map((s) => (
                                    <g key={s.idx}>
                                        <line
                                            x1={s.x1}
                                            y1={s.y1}
                                            x2={s.x2}
                                            y2={s.y2}
                                            stroke={str_purple}
                                            strokeWidth={v.stroke}
                                            strokeLinecap="round"
                                        />
                                        <circle
                                            cx={s.x2}
                                            cy={s.y2}
                                            r={1.7 + v.depth * 0.9}
                                            fill={str_purple}
                                        />
                                    </g>
                                ))}

                                <circle
                                    cx="32"
                                    cy="32"
                                    r="18"
                                    stroke={str_purple}
                                    strokeWidth={v.stroke * 1.15}
                                />
                            </svg>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Virusbglayer;
