import { Crate } from "./crate"

// Base
const base = new Entity()
base.addComponent(new GLTFShape("models/baseLight.glb"))
engine.addEntity(base)

// Configuration
const Y_OFFSET = 0.05
const Z_OFFSET = 1.5
const MOVE_SPEED = 3
const GROUND_HEIGHT = 0.55

// Crate
const crate = new Crate(new GLTFShape("models/crate.glb"), new Transform({ position: new Vector3(8, GROUND_HEIGHT, 8) }))

// Grab system
@Component("grabbedFlag")
class GrabbedFlag {}

class GrabObjectSystem implements ISystem {
  grabbedObjectGroup = engine.getComponentGroup(GrabbedFlag)

  update(dt: number) {
    for (let object of this.grabbedObjectGroup.entities) {
      // Calculates the position of the grabbed object
      let transform = object.getComponent(Transform)
      let forwardVector: Vector3 = Vector3.Forward().scale(Z_OFFSET).rotate(Camera.instance.rotation)
      let updatePosition: Vector3 = Camera.instance.position.clone().add(forwardVector)

      // Rotate object to face the player without tilting
      transform.lookAt(Camera.instance.position)
      transform.rotation.x = 0
      transform.rotation.z = 0

      // Smooths out the positional movements of the object
      transform.position = Vector3.Lerp(transform.position, updatePosition, dt * MOVE_SPEED)
      transform.position.y -= Y_OFFSET
    }
  }
}
engine.addSystem(new GrabObjectSystem())

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
  if (crate.isGrabbed) {
    if (!crate.hasComponent(GrabbedFlag)) {
      pickUpSound.getComponent(AudioSource).playOnce()
      crate.addComponent(new GrabbedFlag())
    } else {
      crate.isGrabbed = false
      putDownSound.getComponent(AudioSource).playOnce()
      crate.removeComponent(GrabbedFlag)
      crate.getComponent(OnPointerDown).hoverText = "Pick Up"
      crate.getComponent(Transform).position.y = GROUND_HEIGHT
    }
  }
})
