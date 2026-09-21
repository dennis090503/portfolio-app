/**
 * ThemeCanvas — currently unused / reserved for future use.
 * This component renders a Three.js animated sphere that reacts to theme changes.
 * It is NOT imported or rendered anywhere in the app yet.
 * Integrate into Navbar or a dedicated UI slot when needed.
 */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function ThemeCanvas({ isDark }) {
  const mountRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup sized precisely next to your custom switch component
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camera.position.z = 2.4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(34, 34);
    container.appendChild(renderer.domElement);

    // 2. High density sphere geometry setup
    const geometry = new THREE.IcosahedronGeometry(0.65, 3);
    
    // Correct color profiles: Bright premium orange for Dark Mode, Deep charcoal ink for Light Mode
    const initialColor = isDark ? 0xff5500 : 0x171717;
    const material = new THREE.MeshPhysicalMaterial({
      color: initialColor,
      roughness: isDark ? 0.15 : 0.45,
      metalness: isDark ? 0.95 : 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Realistic light source configuration vectors
    const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
    light1.position.set(1, 2, 3);
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(light2);

    meshRef.current = mesh;

    // Orbit speed physics rotation parameters
    let reqId;
    const animate = () => {
      mesh.rotation.y += 0.006;
      mesh.rotation.x += 0.003;
      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 3. GSAP material mesh transformation running whenever theme toggles
  useEffect(() => {
    if (!meshRef.current) return;

    // Map correct structural vectors (isDark targets Solid Orange, Light Mode targets Matte Black)
    const targetColor = isDark ? new THREE.Color(0xff5500) : new THREE.Color(0x171717);
    
    gsap.to(meshRef.current.material.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.7,
      ease: "power2.out"
    });

    gsap.to(meshRef.current.material, {
      metalness: isDark ? 0.95 : 0.1,
      roughness: isDark ? 0.15 : 0.45,
      duration: 0.7,
      ease: "power2.out"
    });

    // Reactive bounce scale animation triggered by switch state change
    gsap.fromTo(meshRef.current.scale, 
      { x: 0.5, y: 0.5, z: 0.5 },
      { x: 1, y: 1, z: 1, duration: 0.6, ease: "elastic.out(1, 0.6)" }
    );
  }, [isDark]);

  return (
    <div 
      ref={mountRef} 
      className="w-[34px] h-[34px] flex items-center justify-center pointer-events-none select-none mr-1"
    />
  );
}