"use client";

import { useEffect, useRef } from "react";

const VIEW_WIDTH = 420;
const VIEW_HEIGHT = 220;

const BASE = { x: 78, y: 156 };
const UPPER_LENGTH = 104;
const FOREARM_LENGTH = 90;
const CUBE = { x: 258, y: 168 };
const REST_TARGET = { x: CUBE.x - 10, y: CUBE.y + 12 };

type Point = { x: number; y: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toDegrees = (radians: number) => (radians * 180) / Math.PI;

function solve(target: Point) {
  const dx = target.x - BASE.x;
  const dy = target.y - BASE.y;
  const rawDistance = Math.hypot(dx, dy);
  const distance = clamp(
    rawDistance,
    Math.abs(UPPER_LENGTH - FOREARM_LENGTH) + 2,
    UPPER_LENGTH + FOREARM_LENGTH - 2,
  );
  const targetAngle = Math.atan2(dy, dx);
  const cosine = clamp(
    (UPPER_LENGTH ** 2 + distance ** 2 - FOREARM_LENGTH ** 2) /
      (2 * UPPER_LENGTH * distance),
    -1,
    1,
  );

  // Elbow-up solution: the shoulder sits above the straight line to the target.
  const shoulderAngle = targetAngle - Math.acos(cosine);
  const elbow = {
    x: BASE.x + UPPER_LENGTH * Math.cos(shoulderAngle),
    y: BASE.y + UPPER_LENGTH * Math.sin(shoulderAngle),
  };
  const forearmAngle = Math.atan2(target.y - elbow.y, target.x - elbow.x);
  const wrist = {
    x: elbow.x + FOREARM_LENGTH * Math.cos(forearmAngle),
    y: elbow.y + FOREARM_LENGTH * Math.sin(forearmAngle),
  };

  return { shoulderAngle, forearmAngle, elbow, wrist };
}

const INITIAL = solve(REST_TARGET);

function formatAngle(radians: number) {
  const degrees = toDegrees(radians);
  const rounded = Math.round(degrees);
  return `${rounded >= 0 ? "+" : "−"}${String(Math.abs(rounded)).padStart(3, "0")}`;
}

export default function RoboticArm() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const upperRef = useRef<SVGLineElement>(null);
  const forearmRef = useRef<SVGLineElement>(null);
  const elbowRef = useRef<SVGCircleElement>(null);
  const wristRef = useRef<SVGCircleElement>(null);
  const gripperRef = useRef<SVGGElement>(null);
  const j1Ref = useRef<HTMLSpanElement>(null);
  const j2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const upper = upperRef.current;
    const forearm = forearmRef.current;
    const elbow = elbowRef.current;
    const wrist = wristRef.current;
    const gripper = gripperRef.current;
    if (!root || !svg || !upper || !forearm || !elbow || !wrist || !gripper) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stage = root.closest<HTMLElement>("[data-arm-stage]") ?? root;
    let frame = 0;
    let visible = false;
    let lastTime = 0;
    let lastTelemetry = 0;
    let pointerAt = 0;
    let target = { ...REST_TARGET };
    let current = { ...REST_TARGET };

    const draw = (point: Point, time: number) => {
      const pose = solve(point);

      upper.setAttribute("x2", pose.elbow.x.toFixed(2));
      upper.setAttribute("y2", pose.elbow.y.toFixed(2));
      forearm.setAttribute("x1", pose.elbow.x.toFixed(2));
      forearm.setAttribute("y1", pose.elbow.y.toFixed(2));
      forearm.setAttribute("x2", pose.wrist.x.toFixed(2));
      forearm.setAttribute("y2", pose.wrist.y.toFixed(2));
      elbow.setAttribute("cx", pose.elbow.x.toFixed(2));
      elbow.setAttribute("cy", pose.elbow.y.toFixed(2));
      wrist.setAttribute("cx", pose.wrist.x.toFixed(2));
      wrist.setAttribute("cy", pose.wrist.y.toFixed(2));

      gripper.setAttribute(
        "transform",
        `translate(${pose.wrist.x.toFixed(2)} ${pose.wrist.y.toFixed(
          2,
        )}) rotate(${toDegrees(pose.forearmAngle).toFixed(2)})`,
      );

      if (time - lastTelemetry > 120) {
        lastTelemetry = time;
        if (j1Ref.current) {
          j1Ref.current.textContent = formatAngle(pose.shoulderAngle);
        }
        if (j2Ref.current) {
          j2Ref.current.textContent = formatAngle(
            pose.forearmAngle - pose.shoulderAngle,
          );
        }
      }
    };

    const tick = (time: number) => {
      if (!visible || document.hidden) {
        frame = 0;
        return;
      }

      const delta = lastTime ? Math.min(time - lastTime, 64) : 16;
      lastTime = time;

      if (time - pointerAt > 2200) {
        target = {
          x: REST_TARGET.x + Math.sin(time / 2400) * 7,
          y: REST_TARGET.y + Math.cos(time / 3100) * 5,
        };
      }

      const ease = 1 - Math.exp(-delta / 150);
      current = {
        x: current.x + (target.x - current.x) * ease,
        y: current.y + (target.y - current.y) * ease,
      };

      draw(current, time);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frame && !reduced.matches) {
        lastTime = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const matrix = svg.getScreenCTM();
      if (!matrix) return;

      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const local = point.matrixTransform(matrix.inverse());

      target = {
        x: clamp(local.x, 54, VIEW_WIDTH - 42),
        y: clamp(local.y, 36, VIEW_HEIGHT - 22),
      };
      pointerAt = performance.now();
      start();
    };

    const onPointerLeave = () => {
      pointerAt = 0;
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };

    draw(REST_TARGET, 0);

    if (reduced.matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
        if (visible) start();
        else stop();
      },
      { rootMargin: "160px" },
    );
    observer.observe(root);

    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      stop();
      observer.disconnect();
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className="robotic-arm" ref={rootRef} aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        fill="none"
        focusable="false"
        role="presentation"
      >
        <g className="arm-grid">
          {[60, 120, 180, 240, 300, 360].map((x) => (
            <line key={`x-${x}`} x1={x} y1="28" x2={x} y2="196" />
          ))}
          {[50, 90, 130, 170].map((y) => (
            <line key={`y-${y}`} x1="30" y1={y} x2="392" y2={y} />
          ))}
          <circle cx="30" cy="196" r="1.6" />
          <circle cx="392" cy="196" r="1.6" />
        </g>

        <line className="arm-ground" x1="20" y1="196" x2="400" y2="196" />
        <text className="arm-label" x="20" y="210">
          GND
        </text>
        <text className="arm-label" x="400" y="210" textAnchor="end">
          M-01 / LIVE
        </text>

        <g className="arm-target">
          <circle cx={CUBE.x + 11} cy="184" r="27" />
          <path d={`M${CUBE.x + 11} 148v-8`} />
          <text x={CUBE.x + 11} y="134" textAnchor="middle">
            TARGET
          </text>
        </g>

        <g transform={`translate(${CUBE.x} ${CUBE.y})`} className="arm-cube">
          <polygon points="0,8 11,2 22,8 11,14" />
          <polygon points="0,8 0,22 11,28 11,14" />
          <polygon points="22,8 22,22 11,28 11,14" />
        </g>

        <g className="arm-base">
          <path d="M48 196 64 158h28l16 38Z" />
          <rect x="58" y="150" width="40" height="10" rx="3" />
          <circle cx={BASE.x} cy={BASE.y} r="11" className="arm-joint-base" />
          <circle cx={BASE.x} cy={BASE.y} r="3.5" className="arm-joint-core" />
        </g>

        <line
          ref={upperRef}
          className="arm-link arm-link-upper"
          x1={BASE.x}
          y1={BASE.y}
          x2={INITIAL.elbow.x}
          y2={INITIAL.elbow.y}
        />
        <circle
          ref={elbowRef}
          className="arm-joint"
          cx={INITIAL.elbow.x}
          cy={INITIAL.elbow.y}
          r="8"
        />
        <line
          ref={forearmRef}
          className="arm-link arm-link-forearm"
          x1={INITIAL.elbow.x}
          y1={INITIAL.elbow.y}
          x2={INITIAL.wrist.x}
          y2={INITIAL.wrist.y}
        />
        <g
          ref={gripperRef}
          className="arm-gripper"
          transform={`translate(${INITIAL.wrist.x.toFixed(2)} ${INITIAL.wrist.y.toFixed(
            2,
          )}) rotate(${toDegrees(INITIAL.forearmAngle).toFixed(2)})`}
        >
          <line x1="0" y1="0" x2="7" y2="0" />
          <path d="M7-8 17-10 17-4" />
          <path d="M7 8 17 10 17 4" />
        </g>
        <circle
          ref={wristRef}
          className="arm-joint arm-joint-wrist"
          cx={INITIAL.wrist.x}
          cy={INITIAL.wrist.y}
          r="5.5"
        />

        <text className="arm-label arm-label-j1" x="48" y="150">
          J1
        </text>
      </svg>

      <div className="arm-telemetry">
        <span>
          J1 <b ref={j1Ref}>{formatAngle(INITIAL.shoulderAngle)}</b>
        </span>
        <span>
          J2{" "}
          <b ref={j2Ref}>
            {formatAngle(INITIAL.forearmAngle - INITIAL.shoulderAngle)}
          </b>
        </span>
        <span className="arm-mode">
          <i />
          tracking
        </span>
      </div>
    </div>
  );
}

