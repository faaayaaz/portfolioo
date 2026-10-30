import { useEffect, useMemo, useRef } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import * as THREE from "three";
import { worldContent, type WorldStation } from "../../data/world";
export type IslandSceneProps = {
  destination: string | null;
  travel: number;
  keys: React.MutableRefObject<Set<string>>;
  onVisit: (id: string) => void;
  onCollect: (index: number) => void;
  onReady: () => void;
  onFail: () => void;
  theme: string;
  zoom: number;
  active: boolean;
  view: number;
};
const coral = "#ef9c8b",
  cream = "#f4ecda",
  mint = "#a8d6bf",
  ink = "#29475b";
function Box({
  position,
  size,
  color = cream,
  rotation = 0,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  rotation?: number;
}) {
  return (
    <mesh
      position={position}
      rotation={[0, rotation, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}
function Tree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.8, 6]} />
        <meshStandardMaterial color="#68746a" />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.65, 1.4, 6]} />
        <meshStandardMaterial color="#588f7f" flatShading />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <coneGeometry args={[0.47, 1.1, 6]} />
        <meshStandardMaterial color="#79ab8e" flatShading />
      </mesh>
    </group>
  );
}
function Label({
  text,
  position,
  color,
  onClick,
}: {
  text: string;
  position: [number, number, number];
  color: string;
  onClick: () => void;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 112;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#17283bed";
    c.beginPath();
    c.roundRect(4, 4, 504, 104, 52);
    c.fill();
    c.strokeStyle = "#ffffff33";
    c.lineWidth = 2;
    c.stroke();
    c.fillStyle = color;
    c.beginPath();
    c.arc(45, 56, 9, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#f6f4ea";
    c.font = "500 31px sans-serif";
    c.fillText(text, 70, 67);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite
      position={position}
      scale={[3.3, 0.72, 1]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  );
}
function Healthcare() {
  return (
    <group>
      <Box position={[0, 0.18, 0]} size={[3, 0.3, 2.25]} color="#d8e7d3" />
      <Box position={[-0.55, 0.95, 0]} size={[1.7, 1.55, 1.5]} />
      <Box
        position={[0.8, 0.65, 0.15]}
        size={[1.1, 0.95, 1.2]}
        color="#d5ded4"
      />
      <Box
        position={[-0.55, 1.78, 0]}
        size={[1.85, 0.16, 1.65]}
        color="#b8cebd"
      />
      {[-0.99, -0.5].map((x) =>
        [0.65, 1.15].map((y) => (
          <Box
            key={`${x}${y}`}
            position={[x, y, 0.756]}
            size={[0.32, 0.26, 0.025]}
            color="#608b9d"
          />
        )),
      )}
      <Box
        position={[0.8, 0.7, 0.762]}
        size={[0.44, 0.1, 0.035]}
        color={coral}
      />
      <Box
        position={[0.8, 0.7, 0.764]}
        size={[0.1, 0.44, 0.035]}
        color={coral}
      />
      <Box
        position={[-0.05, 0.52, 0.762]}
        size={[0.29, 0.6, 0.045]}
        color={ink}
      />
      <Box
        position={[-0.05, 0.84, 0.9]}
        size={[0.6, 0.08, 0.42]}
        color="#7ec3ba"
      />
    </group>
  );
}
function Neural() {
  const core = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (core.current) {
      core.current.rotation.y = s.clock.elapsedTime * 0.2;
      core.current.position.y =
        1.7 + Math.sin(s.clock.elapsedTime * 0.8) * 0.12;
    }
  });
  return (
    <group>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.55, 1.65, 0.35, 6]} />
        <meshStandardMaterial color={cream} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.14, 48]} />
        <meshStandardMaterial color="#82989e" />
      </mesh>
      <group ref={core} position={[0, 1.7, 0]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial
            color="#bca6e3"
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.78, 1]} />
          <meshBasicMaterial
            color="#eadbff"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
        {[0.6, -0.6].map((a, i) => (
          <mesh key={a} rotation={[a, 0.3, i * 0.8]}>
            <torusGeometry args={[1.14, 0.035, 8, 64]} />
            <meshStandardMaterial
              color={i ? "#95c4e3" : "#d4b2f3"}
              emissive={i ? "#95c4e3" : "#d4b2f3"}
              emissiveIntensity={0.25}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
function People() {
  return (
    <group>
      <Box position={[0, 0.18, 0]} size={[3, 0.3, 2.25]} color="#e6dfc5" />
      {[0.65, 1.25, 1.9, 1.1].map((h, i) => (
        <group key={i}>
          <Box
            position={[-1 + i * 0.65, 0.4 + h / 2, 0]}
            size={[0.47, h, 0.6]}
            color={["#86b9ab", "#9bacd6", "#efbf86", "#c8b4d9"][i]}
          />
          <mesh position={[-1 + i * 0.65, 0.65 + h, 0]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color={cream} />
          </mesh>
        </group>
      ))}
      <Box position={[0, 0.42, 0.8]} size={[2.6, 0.12, 0.16]} color="#a2bfa6" />
    </group>
  );
}
function Iot() {
  const rings = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (rings.current) rings.current.rotation.y = clock.elapsedTime * 0.25;
  });
  return (
    <group>
      <Box position={[0, 0.18, 0]} size={[3, 0.3, 2.25]} color="#bed1c4" />
      <Box position={[-0.3, 0.75, 0]} size={[1.6, 1.1, 1.3]} />
      <mesh
        position={[-0.3, 1.65, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <coneGeometry args={[1.3, 0.8, 4]} />
        <meshStandardMaterial color="#7da1ad" />
      </mesh>
      <Box
        position={[-0.65, 0.8, 0.66]}
        size={[0.42, 0.45, 0.025]}
        color="#77bbc9"
      />
      <Box position={[0.05, 0.65, 0.66]} size={[0.35, 0.8, 0.04]} color={ink} />
      <Box position={[1, 1.05, 0]} size={[0.09, 1.8, 0.09]} color="#c7d6d1" />
      <group ref={rings} position={[1, 2.1, 0]}>
        {[0.4, 0.65].map((r) => (
          <mesh key={r} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.023, 6, 48]} />
            <meshStandardMaterial
              color="#8ecbea"
              emissive="#8ecbea"
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
function Beacon() {
  const top = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (top.current) top.current.rotation.y = clock.elapsedTime * 0.25;
  });
  return (
    <group position={[-1.1, 0, 0.8]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.2, 0.35, 8]} />
        <meshStandardMaterial color={cream} />
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.7, 1.15, 8]} />
        <meshStandardMaterial color="#78a5ac" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.18, 8]} />
        <meshStandardMaterial color={cream} />
      </mesh>
      <mesh ref={top} position={[0, 2.07, 0]} castShadow>
        <octahedronGeometry args={[0.45]} />
        <meshStandardMaterial
          color="#eac795"
          emissive="#eac795"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 1.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.02, 8, 64]} />
        <meshBasicMaterial color="#f5d9a5" />
      </mesh>
    </group>
  );
}
function Station({
  station,
  index,
  selected,
  onVisit,
}: {
  station: WorldStation;
  index: number;
  selected: boolean;
  onVisit: (id: string) => void;
}) {
  const hover = useRef<THREE.Group>(null);
  return (
    <group position={[station.x, 0.22, station.z]}>
      <group
        ref={hover}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          if (hover.current) hover.current.scale.setScalar(1.035);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
          hover.current?.scale.setScalar(1);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onVisit(station.id);
        }}
      >
        {[<Healthcare />, <Neural />, <People />, <Iot />][index]}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[1.65, selected ? 1.75 : 1.68, 64]} />
        <meshBasicMaterial
          color={station.color}
          transparent
          opacity={selected ? 0.9 : 0.4}
        />
      </mesh>
      <Label
        text={station.name}
        position={[0, index === 1 ? 3.35 : 2.9, 0]}
        color={station.color}
        onClick={() => onVisit(station.id)}
      />
    </group>
  );
}
function Rover({
  keys,
  view,
  destination,
  travel,
  onVisit,
  onCollect,
}: {
  keys: IslandSceneProps["keys"];
  view: number;
  destination: string | null;
  travel: number;
  onVisit: IslandSceneProps["onVisit"];
  onCollect: IslandSceneProps["onCollect"];
}) {
  const rover = useRef<THREE.Group>(null),
    target = useRef(new THREE.Vector3(-3, 0.62, 2.4)),
    manual = useRef(false),
    collected = useRef(new Set<number>()),
    lastStation = useRef<string | null>(null),
    lastPosition = useRef({ x: -3, z: 2.4, time: 0 });
  useEffect(() => {
    const station = worldContent.stations.find((s) => s.id === destination);
    if (station) {
      target.current.set(station.x, 0.62, station.z + 1.8);
      manual.current = false;
    }
  }, [destination, travel]);
  useEffect(() => {
    const move = (e: Event) => {
      const p = (e as CustomEvent).detail;
      target.current.set(p.x, 0.62, p.z);
      manual.current = false;
    };
    window.addEventListener("island-move", move);
    return () => window.removeEventListener("island-move", move);
  }, []);
  useFrame(({ clock }, delta) => {
    if (!rover.current) return;
    const g = rover.current,
      k = keys.current,
      dt = Math.min(delta, 0.045);
    let x = 0,
      z = 0;
    const angle = 0.62 + (view * Math.PI) / 2;
    const forwardX = Math.sin(angle),
      forwardZ = Math.cos(angle);
    if (k.has("w") || k.has("arrowup")) {
      x -= forwardX;
      z -= forwardZ;
    }
    if (k.has("s") || k.has("arrowdown")) {
      x += forwardX;
      z += forwardZ;
    }
    if (k.has("a") || k.has("arrowleft")) {
      x -= forwardZ;
      z += forwardX;
    }
    if (k.has("d") || k.has("arrowright")) {
      x += forwardZ;
      z -= forwardX;
    }
    if (x || z) {
      manual.current = true;
      const len = Math.hypot(x, z);
      target.current.set(
        g.position.x + (x / len) * 4 * dt,
        0.62,
        g.position.z + (z / len) * 4 * dt,
      );
      const norm =
        (target.current.x / 7.6) ** 2 + (target.current.z / 4.9) ** 2;
      if (norm > 1) {
        target.current.x /= Math.sqrt(norm);
        target.current.z /= Math.sqrt(norm);
      }
    }
    const diff = target.current.clone().sub(g.position);
    diff.y = 0;
    if (diff.length() > 0.03) {
      const angle = Math.atan2(diff.x, diff.z);
      g.rotation.y +=
        THREE.MathUtils.euclideanModulo(
          angle - g.rotation.y + Math.PI,
          Math.PI * 2,
        ) - Math.PI;
      g.position.lerp(
        target.current,
        manual.current ? 1 : 1 - Math.exp(-2.8 * dt),
      );
    }
    g.position.y = 0.62 + Math.sin(clock.elapsedTime * 3) * 0.035;
    if (
      clock.elapsedTime - lastPosition.current.time > 0.2 &&
      Math.hypot(
        g.position.x - lastPosition.current.x,
        g.position.z - lastPosition.current.z,
      ) > 0.03
    ) {
      lastPosition.current = {
        x: g.position.x,
        z: g.position.z,
        time: clock.elapsedTime,
      };
      window.dispatchEvent(
        new CustomEvent("island-position", {
          detail: { x: g.position.x, z: g.position.z },
        }),
      );
    }
    worldContent.stations.forEach((s) => {
      if (
        Math.hypot(g.position.x - s.x, g.position.z - (s.z + 1.8)) < 0.65 &&
        lastStation.current !== s.id
      ) {
        lastStation.current = s.id;
        onVisit(s.id);
      }
    });
    worldContent.discoveries.forEach((d, i) => {
      if (
        !collected.current.has(i) &&
        Math.hypot(g.position.x - d.x, g.position.z - d.z) < 0.75
      ) {
        collected.current.add(i);
        onCollect(i);
      }
    });
  });
  return (
    <group ref={rover} position={[-3, 0.62, 2.4]} scale={0.72}>
      <Box position={[0, 0.08, 0]} size={[0.88, 0.3, 1.18]} color="#eff0dc" />
      <Box
        position={[0, 0.32, -0.1]}
        size={[0.66, 0.33, 0.67]}
        color="#486477"
      />
      <Box position={[0, 0.52, -0.1]} size={[0.72, 0.07, 0.74]} color={coral} />
      {[-0.51, 0.51].map((x) =>
        [-0.38, 0.38].map((z) => (
          <mesh
            key={`${x}${z}`}
            position={[x, 0, z]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.23, 0.23, 0.2, 12]} />
            <meshStandardMaterial color="#253b49" />
          </mesh>
        )),
      )}
      {[-0.26, 0.26].map((x) => (
        <mesh key={x} position={[x, 0.14, 0.6]}>
          <boxGeometry args={[0.18, 0.1, 0.03]} />
          <meshBasicMaterial color="#fff1b9" />
        </mesh>
      ))}
      <mesh position={[0, 0.64, -0.1]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#ffc9a7" />
      </mesh>
    </group>
  );
}
function Discovery({
  index,
  onCollect,
}: {
  index: number;
  onCollect: (i: number) => void;
}) {
  const ref = useRef<THREE.Mesh>(null),
    hidden = useRef(false);
  useEffect(() => {
    const collected = (e: Event) => {
      if ((e as CustomEvent).detail === index) hidden.current = true;
    };
    window.addEventListener("island-collected", collected);
    return () => window.removeEventListener("island-collected", collected);
  }, [index]);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = !hidden.current;
      ref.current.rotation.y = clock.elapsedTime;
      ref.current.position.y =
        0.6 + Math.sin(clock.elapsedTime * 2 + index) * 0.12;
    }
  });
  const p = worldContent.discoveries[index];
  return (
    <mesh
      ref={ref}
      position={[p.x, 0.6, p.z]}
      onClick={(e) => {
        e.stopPropagation();
        hidden.current = true;
        onCollect(index);
      }}
    >
      <octahedronGeometry args={[0.12]} />
      <meshStandardMaterial
        color="#ffe3a0"
        emissive="#ffe3a0"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}
function Camera({ zoom, view }: { zoom: number; view: number }) {
  const { camera, size } = useThree();
  useFrame(() => {
    const c = camera as THREE.OrthographicCamera,
      small = size.width < 700;
    const angle = 0.62 + (view * Math.PI) / 2;
    c.position.lerp(
      new THREE.Vector3(Math.sin(angle) * 22, 18, Math.cos(angle) * 22),
      0.055,
    );
    c.lookAt(small ? 0 : -2, small ? 1.3 : 0, 0);
    const desired =
      Math.min(
        size.width / (small ? 20 : 29),
        size.height / (small ? 23 : 19),
      ) * zoom;
    c.zoom = THREE.MathUtils.lerp(c.zoom, desired, 0.1);
    c.updateProjectionMatrix();
  });
  return null;
}
function Island(props: IslandSceneProps) {
  const { theme, destination, onVisit, onCollect, zoom, view } = props;
  const day = theme === "clinical",
    sky = day
      ? "#e9e6e1"
      : theme === "violet"
        ? "#24213c"
        : theme === "emerald"
          ? "#162f31"
          : "#1b2637";
  const visited = useRef(false);
  useFrame(() => {
    if (!visited.current) {
      visited.current = true;
      props.onReady();
    }
  });
  const route = useMemo(() => {
    const points = Array.from({ length: 49 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * 6.4, 0.18, Math.sin(a) * 3.9);
    });
    return new THREE.CatmullRomCurve3(points, true);
  }, []);
  const ground = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const norm = (e.point.x / 7.6) ** 2 + (e.point.z / 4.9) ** 2;
    if (norm <= 1)
      window.dispatchEvent(
        new CustomEvent("island-move", {
          detail: { x: e.point.x, z: e.point.z },
        }),
      );
  };
  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 35, 75]} />
      <ambientLight intensity={day ? 0.75 : 0.6} />
      <hemisphereLight args={["#d2e9f4", "#3b5e5d", 0.9]} />
      <directionalLight
        position={[-8, 14, 7]}
        intensity={day ? 2.4 : 2}
        color="#fff0d5"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-bias={-0.001}
      />
      <directionalLight
        position={[8, 6, -10]}
        intensity={0.9}
        color="#ada9ef"
      />
      <group>
        <mesh
          position={[0, -1, 0]}
          scale={[1, 1, 0.7]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[8.9, 7.1, 1.8, 9]} />
          <meshStandardMaterial color="#496e70" flatShading />
        </mesh>
        <mesh
          position={[0, -0.1, 0]}
          scale={[1, 1, 0.7]}
          receiveShadow
          castShadow
        >
          <cylinderGeometry args={[9, 9, 0.25, 64]} />
          <meshStandardMaterial color={day ? "#acd1af" : "#8dbba5"} />
        </mesh>
        <mesh
          position={[0, 0.045, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerDown={ground}
          scale={[1, 0.7, 1]}
        >
          <circleGeometry args={[9, 64]} />
          <meshStandardMaterial
            color={day ? "#b5d8b5" : "#9ac6ad"}
            roughness={1}
          />
        </mesh>
        <mesh receiveShadow>
          <tubeGeometry args={[route, 100, 0.22, 6, true]} />
          <meshStandardMaterial color="#e3e0ca" />
        </mesh>
        {worldContent.stations.map((s, i) => (
          <Station
            key={s.id}
            station={s}
            index={i}
            selected={destination === s.id}
            onVisit={onVisit}
          />
        ))}
        <Beacon />
        {[
          [-6.7, 0, 1.3, 0.9],
          [-5.9, 0, 2.2, 0.7],
          [-3.6, 0, -3.4, 0.7],
          [-2.6, 0, -4.6, 0.8],
          [2.8, 0, -3.5, 0.65],
          [6.6, 0, -1.4, 0.8],
          [5.7, 0, 2.4, 0.85],
          [4.6, 0, 3.1, 0.65],
          [-2.5, 0, 4.4, 0.75],
          [-5.4, 0, 3.4, 0.65],
        ].map(([x, y, z, s], i) => (
          <Tree key={i} position={[x, y, z]} scale={s} />
        ))}
        {Array.from({ length: 16 }, (_, i) => {
          const a = i * 2.4;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(a) * (7 + (i % 2) * 0.5),
                0.22,
                Math.sin(a) * (4.2 + (i % 2) * 0.4),
              ]}
              scale={[0.35 + (i % 3) * 0.1, 0.25, 0.4]}
              castShadow
            >
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial
                color={i % 2 ? "#8b9e91" : "#d3d4b8"}
                flatShading
              />
            </mesh>
          );
        })}
        {worldContent.discoveries.map((_, i) => (
          <Discovery key={i} index={i} onCollect={onCollect} />
        ))}
        <Rover
          keys={props.keys}
          view={view}
          destination={destination}
          travel={props.travel}
          onVisit={onVisit}
          onCollect={onCollect}
        />
        <Label
          text="FAYAZ’S DATA ISLAND"
          position={[-2.3, 0.4, 4.8]}
          color="#efbc8d"
          onClick={() => {}}
        />
      </group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.4, 0]}
        receiveShadow
      >
        <circleGeometry args={[70, 64]} />
        <meshBasicMaterial color={sky} toneMapped={false} />
      </mesh>
      {[14, 18, 23].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.38, 0]}>
          <ringGeometry args={[r, r + 0.025, 96]} />
          <meshBasicMaterial
            color={day ? "#e3eded" : "#567986"}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
      <mesh position={[-13, 7, -17]}>
        <sphereGeometry args={[2.2, 24, 24]} />
        <meshBasicMaterial color={day ? "#e9c4aa" : "#a4a4c9"} />
      </mesh>
      <mesh position={[-13, 7, -17]} rotation={[0.7, 0.1, 0.4]}>
        <torusGeometry args={[3.4, 0.045, 8, 64]} />
        <meshBasicMaterial color={day ? "#ddbaa7" : "#7e8ba7"} />
      </mesh>
      {[-1, 1].map((n, i) => (
        <group key={n} position={[n * 12, 3 + i * 2, -6]}>
          {[0, 1, 2].map((j) => (
            <mesh key={j} position={[j * 0.8, Math.sin(j) * 0.4, 0]}>
              <sphereGeometry args={[1 - j * 0.17, 12, 12]} />
              <meshStandardMaterial
                color={day ? "#f6f0e6" : "#6e8093"}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      ))}
      <Camera zoom={zoom} view={view} />
    </>
  );
}
export default function IslandScene(props: IslandSceneProps) {
  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [14, 18, 18], zoom: 40, near: 0.1, far: 120 }}
      frameloop={props.active ? "always" : "never"}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", props.onFail, {
          once: true,
        });
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
      aria-hidden="true"
    >
      <Island {...props} />
    </Canvas>
  );
}
