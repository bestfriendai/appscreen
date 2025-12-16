import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { GLTF } from 'three-stdlib';
import { useAppStore } from '../../store/useAppStore';
import type { DeviceFrame } from '../../types';

interface Device3DProps {
  screenshotUrl: string | null;
  width: number;
  height: number;
}

interface PhoneModelProps {
  screenshotUrl: string | null;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
  deviceFrame: DeviceFrame;
}

// Model URLs for different devices
const MODEL_URLS: Record<DeviceFrame, string | null> = {
  none: null,
  'iphone-15-pro-max': '/models/iphone-15-pro-max.glb',
  'iphone-15-pro': '/models/iphone-15-pro-max.glb',
  'iphone-15': '/models/iphone-15-pro-max.glb',
};

// Screen dimensions for different devices (relative to model)
const SCREEN_CONFIGS: Record<DeviceFrame, { width: number; height: number; offsetY: number; scale: number }> = {
  none: { width: 0.068, height: 0.148, offsetY: 0, scale: 1 },
  'iphone-15-pro-max': { width: 0.068, height: 0.148, offsetY: 0, scale: 1 },
  'iphone-15-pro': { width: 0.065, height: 0.140, offsetY: 0, scale: 0.95 },
  'iphone-15': { width: 0.063, height: 0.136, offsetY: 0, scale: 0.92 },
};

function PhoneModel({ screenshotUrl, rotationX, rotationY, rotationZ, scale, deviceFrame }: PhoneModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const screenMeshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  const modelUrl = MODEL_URLS[deviceFrame];
  const screenConfig = SCREEN_CONFIGS[deviceFrame];

  // Load the model
  const { scene } = useGLTF(modelUrl || '/models/iphone-15-pro-max.glb') as GLTF & { scene: THREE.Group };

  // Load screenshot texture
  useEffect(() => {
    if (!screenshotUrl) {
      setTexture(null);
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.load(
      screenshotUrl,
      (loadedTexture) => {
        loadedTexture.flipY = false;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [screenshotUrl]);

  // Apply rotation smoothly
  useFrame(() => {
    if (groupRef.current) {
      // Smoothly interpolate to target rotation
      const targetX = THREE.MathUtils.degToRad(rotationX);
      const targetY = THREE.MathUtils.degToRad(rotationY);
      const targetZ = THREE.MathUtils.degToRad(rotationZ);

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, 0.1);
    }
  });

  // Find and update the screen material
  useEffect(() => {
    if (scene && texture) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Look for the screen mesh - usually named 'Screen' or similar
          if (
            child.name.toLowerCase().includes('screen') ||
            child.name.toLowerCase().includes('display')
          ) {
            const material = new THREE.MeshBasicMaterial({
              map: texture,
              toneMapped: false,
            });
            child.material = material;
          }
        }
      });
    }
  }, [scene, texture]);

  if (!modelUrl) {
    // Render a simple rectangle for 'none' frame
    return (
      <group ref={groupRef} scale={scale}>
        {texture && (
          <mesh>
            <planeGeometry args={[0.068, 0.148]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
        )}
      </group>
    );
  }

  return (
    <group ref={groupRef} scale={scale * screenConfig.scale}>
      <primitive object={scene.clone()} />
      {/* Overlay screen plane if texture loading */}
      {texture && (
        <mesh position={[0, screenConfig.offsetY, 0.005]} ref={screenMeshRef}>
          <planeGeometry args={[screenConfig.width, screenConfig.height]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

function Scene({ screenshotUrl }: { screenshotUrl: string | null }) {
  const { defaults: { device } } = useAppStore();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
      />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Phone Model */}
      <Suspense
        fallback={
          <Html center>
            <div className="text-white text-sm">Loading model...</div>
          </Html>
        }
      >
        <PhoneModel
          screenshotUrl={screenshotUrl}
          rotationX={device.rotationX}
          rotationY={device.rotationY}
          rotationZ={device.rotationZ}
          scale={device.scale3d}
          deviceFrame={device.frame}
        />
      </Suspense>

      {/* Contact shadows */}
      <ContactShadows
        position={[0, -0.1, 0]}
        opacity={0.4}
        scale={0.5}
        blur={2.5}
        far={0.5}
      />

      {/* Orbit controls for drag-to-rotate */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
      />
    </>
  );
}

// Loader component for the 3D model
function ModelLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg-tertiary/50 rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-text-secondary">Loading 3D model...</span>
      </div>
    </div>
  );
}

export function Device3D({ screenshotUrl, width, height }: Device3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate aspect ratio to match output device
  const aspectRatio = height / width;
  const containerWidth = Math.min(400, width * 0.3);
  const containerHeight = containerWidth * aspectRatio;

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"
      style={{
        width: containerWidth,
        height: Math.min(containerHeight, 500),
      }}
    >
      {isLoading && <ModelLoader />}
      <Canvas
        camera={{ position: [0, 0, 0.3], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        onCreated={() => setIsLoading(false)}
      >
        <Scene screenshotUrl={screenshotUrl} />
      </Canvas>

      {/* Interaction hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-2xs text-text-secondary/60 bg-black/30 px-2 py-1 rounded">
        Drag to rotate
      </div>
    </div>
  );
}

// Preload the model
useGLTF.preload('/models/iphone-15-pro-max.glb');
