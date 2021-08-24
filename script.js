

let camera, scene, cloudParticles = [], composer;

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

    //add orange clouds to scene
    let directionalLight = new THREE.DirectionalLight(0xff8c19)
    directionalLight.position.set(0,0,1)
    scene.add(directionalLight)

    //set orange, red, and blue lights around the clouds
    let orangeLight = new THREE.PointLight(0xcc6600,50,450,1.7);
    orangeLight.position.set(200,300,100);
    scene.add(orangeLight);

    let redLight = new THREE.PointLight(0xd8547e,50,450,1.7);
    redLight.position.set(100,300,100);
    scene.add(redLight);

    let blueLight = new THREE.PointLight(0x3677ac,50,450,1.7);
    blueLight.position.set(300,300,200);
    scene.add(blueLight);

    //set up webGL renderer and set it to the window height and width
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    //add fog to Scene
    scene.fog = new THREE.FogExp2(0x03544e, 0.001)
    renderer.setClearColor(scene.fog.color)
    document.body.appendChild(renderer.domElement)

    //add the cloud to the scene
    let loader = new THREE.TextureLoader()
    loader.load("cloud.png", (texture) => {
        cloudGeo = new THREE.PlaneBufferGeometry(500,500)
        cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        })

        for(let i=0; i<50; i++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial)
            cloud.position.set(
                Math.random() * 800 -400,
                500,
                Math.random() * 500-500
            )
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12
            cloud.rotation.z = Math.random()*2*Math.PI
            cloud.material.opacity = 0.55;
            cloudParticles.push(cloud)
            scene.add(cloud)
        }
    })

    loader.load("stars.jpeg", (texture) => {
            const textureEffect = new POSTPROCESSING.TextureEffect({
                blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
                texture: texture
        })
        textureEffect.blendMode.opacity.value = 0.3
    //add bloom effect to the cloud
    const bloomEffect = new POSTPROCESSING.BloomEffect({
        blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
        kernelSize: POSTPROCESSING.KernelSize.SMALL,
        useLuminanceFilter: true,
        luminanceThreshold: 0.1,
        luminanceSmoothing: 0.25
      });
    bloomEffect.blendMode.opacity.value = 1.5;

    let effectPass = new POSTPROCESSING.EffectPass(
        camera, bloomEffect, textureEffect
    )
    effectPass.renderToScreen = true;
    composer = new POSTPROCESSING.EffectComposer(renderer)
    composer.addPass(new POSTPROCESSING.RenderPass(scene, camera))
    composer.addPass(effectPass)
    window.addEventListener("resize", onWindowResize, false)
    render()
    })
}

//make responsive to window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//run the animation in a loop 
function render() {
    cloudParticles.forEach(particle => {
        particle.rotation.z -=0.001
    })
    composer.render(0.1)
    requestAnimationFrame(render);
}

init()