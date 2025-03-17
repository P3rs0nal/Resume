let scene, camera, renderer, uniforms;

function init() {
  // Scene Setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 1;

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Shader Uniforms
  uniforms = {
    u_time: { value: 1.0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  };

  // Plane Geometry
  let geometry = new THREE.PlaneGeometry(2, 2);
  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution;
        float color = 0.5 + 0.5 * sin(u_time + st.x * 10.0);
        gl_FragColor = vec4(vec3(color), 1.0);
      }
    `
  });

  let plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  animate();
}

function animate() {
  uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// Resize Handling
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
});

// Start Animation
init();