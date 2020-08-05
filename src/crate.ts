export class Crate extends Entity {
  isGrabbed: boolean = false

  constructor(model: GLTFShape, transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)
    
    this.addComponent(
      new OnPointerDown(
        () => {
          this.isGrabbed = true
          this.getComponent(OnPointerDown).hoverText = "Put Down"
        },
        {
          button: ActionButton.PRIMARY,
          hoverText: "Pick Up",
          distance: 5
        }
      )
    )
  }
}
