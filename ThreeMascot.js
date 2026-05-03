import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Spline from '@splinetool/react-spline';

export default function ThreeMascot({ mascotName, isDark, emotion, onInteract }) {
  const mountRef = useRef(null);

  // 1. THE SPLINE STAR: BUD
  if (mascotName?.toLowerCase() === 'bud') {
    return (
      <div className="mascot-3d-container" style={{ width: '100%', height: '450px' }}>
        <Spline scene="https://prod.spline.design/f9d4aa8c-32af-48e2-8ee6-6f0b4176b5e2/scene.splinecode" />
      </div>
    );
  }

  // 2. THE GLB SQUAD: 2 TEACHERS & 2 MASCOTS
  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.4 : 0.8);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    // Path points to the renamed files in your assets folder
    loader.load(`/assets/${mascotName}.glb`, (gltf) => {
      scene.add(gltf.scene);
    }, undefined, (err) => console.error("Asset Load Error:", err));

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [mascotName, isDark]);

  return <div ref={mountRef} className="mascot-3d-container" onPointerDown={onInteract} />;
}