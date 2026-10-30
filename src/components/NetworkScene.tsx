import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
function Network({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null),
    cursor = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      cursor.current = {
        x: (e.clientX / innerWidth) * 2 - 1,
        y: 1 - (e.clientY / innerHeight) * 2,
      };
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  const { points, lines } = useMemo(() => {
    const vertices = Array.from(
      { length: 22 },
      (_, i) =>
        new THREE.Vector3(
          Math.sin(i * 2.4) * (1.6 + Math.sin(i) * 0.4),
          Math.cos(i * 1.7) * 2,
          Math.sin(i * 0.8) * 0.8,
        ),
    );
    const segments: number[] = [];
    vertices.forEach((v, i) =>
      vertices.slice(i + 1).forEach((w) => {
        if (v.distanceTo(w) < 1.4)
          segments.push(...v.toArray(), ...w.toArray());
      }),
    );
    return {
      points: new Float32Array(vertices.flatMap((v) => v.toArray())),
      lines: new Float32Array(segments),
    };
  }, []);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        cursor.current.x * 0.2 + clock.elapsedTime * 0.025,
        0.025,
      );
      group.current.rotation.x = cursor.current.y * 0.08;
    }
  });
  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.045} transparent opacity={0.7} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.18} />
      </lineSegments>
    </group>
  );
}
export default function NetworkScene({ theme }: { theme: string }) {
  void theme;
  const color =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim() || "#c4f29b";
  return (
    <Canvas
      dpr={[1, 1.3]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      aria-hidden="true"
    >
      <Network color={color} />
    </Canvas>
  );
}
