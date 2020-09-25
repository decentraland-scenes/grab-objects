import { Crate } from "./crate"

// Base
const base = new Entity()
base.addComponent(new GLTFShape("models/baseLight.glb"))
engine.addEntity(base)

// Configuration
const Z_OFFSET = 1.5
const GROUND_HEIGHT = 0.55

// Crate
const crate = new Crate(
  new GLTFShape("models/crate.glb"),
  new Transform({
    position: new Vector3(8, GROUND_HEIGHT, 8),
  })
)

// Sounds
const pickUpSound = new Entity()
pickUpSound.addComponent(new AudioSource(new AudioClip("sounds/pickUp.mp3")))
pickUpSound.addComponent(new Transform())
pickUpSound.getComponent(Transform).position = Camera.instance.position
engine.addEntity(pickUpSound)

const putDownSound = new Entity()
putDownSound.addComponent(new AudioSource(new AudioClip("sounds/putDown.mp3")))
putDownSound.addComponent(new Transform())
putDownSound.getComponent(Transform).position = Camera.instance.position
engine.addEntity(putDownSound)

// Controls
Input.instance.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
  let transform = crate.getComponent(Transform)
  if (!crate.isGrabbed) {
    crate.isGrabbed = true
    pickUpSound.getComponent(AudioSource).playOnce()

    // Calculates the crate's position relative to the camera
    transform.position = Vector3.Zero()
    transform.rotation = Quaternion.Zero()
    transform.position.z += Z_OFFSET
    crate.setParent(Attachable.AVATAR)
  } else {
    crate.isGrabbed = false
    putDownSound.getComponent(AudioSource).playOnce()

    // Calculate crate's ground position
    crate.setParent(null) // Remove parent
    let forwardVector: Vector3 = Vector3.Forward().scale(Z_OFFSET).rotate(Camera.instance.rotation)
    transform.position = Camera.instance.position.clone().add(forwardVector)
    transform.lookAt(Camera.instance.position)
    transform.rotation.x = 0
    transform.rotation.z = 0
    transform.position.y = GROUND_HEIGHT
  }
})
