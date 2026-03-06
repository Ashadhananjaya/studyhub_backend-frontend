import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Background3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const particles = new THREE.BufferGeometry();
    const count = 80;
    const posArr = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      posArr[i] = (Math.random() - 0.5) * 30;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const material = new THREE.PointsMaterial({
      size: 0.12,
  
color: document.documentElement.getAttribute('data-theme') === 'light' ? '#6366f1' : '#818cf8',
      transparent: true,
      opacity: 0.6
    });

    const points = new THREE.Points(particles, material);
    scene.add(points);

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
}