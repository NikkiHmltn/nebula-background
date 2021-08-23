let camera, scene;

function init() {
    scene = new THREE.Scene();
    //60 is the angle degrees
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
    //place camera and rotation around
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    //set the ambient light with a soft white glow
    let ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

    //set up webGL renderer and set it to the window height and width
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
