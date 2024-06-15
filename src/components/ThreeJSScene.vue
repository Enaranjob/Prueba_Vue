<template>
  <div>
    <h1 class="title">Clima en tiempo real</h1>

    <div ref="canvas" class="three-scene"><img src="../img/astronauta2.png"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';

export default {
  name: 'ThreeScene',
  setup() {
    const canvas = ref(null);
    let scene, camera, renderer, globe, moon, lantern;

    onMounted(() => {
      // Initialize Three.js scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvas.value.appendChild(renderer.domElement);

      // Background with stars
      const bgGeometry = new THREE.PlaneGeometry(500, 500);
      const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x00001d, side: THREE.BackSide });
      const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
      bgMesh.position.set(0, 0, -1);
      scene.add(bgMesh);

      for (let i = 0; i < 200; i++) {
        let starGeometry = new THREE.SphereGeometry(0.15, 5, 5);
        let starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        let starSphere = new THREE.Mesh(starGeometry, starMaterial);
        starSphere.position.set(
          Math.random() * 500 - 250,
          Math.random() * 500 - 250,
          Math.random() * 500 - 250
        );
        scene.add(starSphere);
      }

      // Globe
      const texture = new THREE.TextureLoader().load(
        "https://raw.githubusercontent.com/PedroOndh/personal-projects-assets/main/globe/earth-texture.jpg"
      );

      const alphaTexture = new THREE.TextureLoader().load(
        "https://raw.githubusercontent.com/PedroOndh/personal-projects-assets/main/globe/earth-alpha-map.jpg"
      );

      const geometry = new THREE.SphereGeometry(15, 32, 16);

      const material = new THREE.MeshPhysicalMaterial({
        color: 0x80c0a1,
        map: texture,
        roughness: 0.4,
        transmission: 0.5,
        thickness: 1,
        reflectivity: 0.7,
        iridescence: 0.7,
        transparent: true,
        side: THREE.DoubleSide,
        alphaMap: alphaTexture
      });

      globe = new THREE.Mesh(geometry, material);
      globe.name = "globe";
      globe.castShadow = true;
      globe.receiveShadow = true;
      scene.add(globe);

      // Internal light (lantern)
      lantern = new THREE.PointLight(0xeb80b1, 50000, 20);
      lantern.name = "lantern";
      lantern.castShadow = true;
      lantern.shadow.bias = -0.005;
      scene.add(lantern);

      let lanternGeometry = new THREE.SphereGeometry(0.2, 6, 6);
      let lanternMaterial = new THREE.MeshBasicMaterial({ color: 0xeb80b1 });
      lanternMaterial.color.multiplyScalar(50000);
      let lanternSphere = new THREE.Mesh(lanternGeometry, lanternMaterial);
      lantern.add(lanternSphere);

      // Adding moon
      const moonTexture = new THREE.TextureLoader().load(
        "https://raw.githubusercontent.com/PedroOndh/personal-projects-assets/main/globe/moon-texture.jpg"
      );

      const moonMaterial = new THREE.MeshLambertMaterial({
        map: moonTexture,
        roughness: 0.8,
        transmission: 0.5,
        reflectivity: 0.7
      });

      moon = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), moonMaterial);
      moon.castShadow = true;
      moon.receiveShadow = true;
      moon.position.set(20, 0, 0);
      scene.add(moon);

      // Lamp base
      const lampBase = new THREE.Mesh(
        new THREE.CylinderGeometry(8, 10, 1, 16),
        new THREE.MeshPhysicalMaterial({
          color: 0x00001d,
          roughness: 0.4
        })
      );

      lampBase.position.set(0, -15.5, 0);
      scene.add(lampBase);

      // Final lighting conditions
      const light = new THREE.PointLight(0xffffff, 100000);
      light.position.set(100, 100, 100);
      scene.add(light);

      camera.position.z = 30;

      let t = 0;
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        globe.rotation.y += 0.0015;
        moon.rotation.y += 0.0015;
        t += 0.0025;
        moon.position.x = 20 * Math.sin(t);
        moon.position.z = 20 * Math.cos(t);
        moon.position.y = 5 * Math.cos(t);

        renderer.render(scene, camera);
      };

      animate();

      // Event listeners
      window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      });

      window.addEventListener("click", () => {
        if (scene.getObjectByName("lantern")) {
          scene.remove(lantern);
        } else {
          scene.add(lantern);
        }
      });
    });

    return { canvas };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap');

.three-scene img {
  position: absolute;
  top: 300px;
  right: 150px;
  padding: 20px;
  font-size: 1.2em;
  width: 400px;
  height: 400px;
}

body {
  margin: 0;
  cursor: pointer;
}

.title {
  position: absolute;
  top: 400px; /* Ajusta la posición verticalmente según sea necesario */
  left: 50%; /* Centra horizontalmente */
  transform: translateX(-50%);
  color: white;
  font-family: 'Kanit', sans-serif; /* Aplica la fuente Kanit */
  text-transform: uppercase;
  font-size: 24px; /* Tamaño del título */
  text-align: center; /* Centra el texto */
  user-select: none;
}

img {
  width: 150px; /* Ancho de la imagen */
  height: 150px;/* Opcional: Redondea las esquinas */
}

</style>

