import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { createWeatherScreen } from './weather.js';

const canvas = document.querySelector('#my-canvas');

// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(100, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(-2, 20, 20);
// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
// Lights
scene.add(new THREE.AmbientLight(0xffffff, 2.5));
const sun = new THREE.DirectionalLight(0xffffff, 5);
sun.position.set(5, 5, 5);
scene.add(sun);

// HTML
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(innerWidth, innerHeight);
cssRenderer.domElement.style.position = 'fixed';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.left = '0';
document.body.appendChild(cssRenderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, cssRenderer.domElement);
controls.target.set(1, -0.5, 0);

// HTML screens: Pokemon img & name, stats and description
function stick(sticker, part, width, height, tilt, moveX = 0, moveY = 0) {
  const box = new THREE.Box3().setFromObject(part);
  const size = box.getSize(new THREE.Vector3()).toArray().sort((a, b) => b - a);
  sticker.scale.setScalar(Math.min(size[0] / width, size[1] / height));

  const direction = box.getCenter(new THREE.Vector3()).sub(camera.position).normalize();
  const hit = new THREE.Raycaster(camera.position, direction).intersectObject(part, true)[0];
  const facing = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).negate();

  sticker.position.copy(hit.point).addScaledVector(facing, 0.01);
  sticker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), facing);
  sticker.rotateY(Math.PI);
  sticker.rotateZ(tilt);
  sticker.translateX(moveX);
  sticker.translateY(moveY);
  scene.add(sticker);
}

// Load the model and the screens
new GLTFLoader().load('public/models/neo-city.glb', function (gltf) {
  const model = gltf.scene;
  scene.add(model);
  model.rotation.y = -Math.PI / 2.3;
  model.position.y = -0.6;
  model.position.z = 1;
  model.updateMatrixWorld(true);

  stick(new CSS3DObject(createWeatherScreen()), model.getObjectByName('Cube003'), 280, 240, 0);
});

// Draw everything
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}
animate();

// Keed the size
addEventListener('resize', function () {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  cssRenderer.setSize(innerWidth, innerHeight);
});