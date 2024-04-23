const {ccclass, property} = cc._decorator;

@ccclass
export default class Joystick extends cc.Component {

    @property(cc.Node)
    JoystickNode: cc.Node = null;

    @property(cc.Node)
    Joystick_Ball: cc.Node = null;

    @property
    Joystick_Vector: cc.Vec3 = cc.v3();

    @property
    Joystick_Max: number = 100;

    private isOn : boolean = false;

    protected onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.Joystick_Touch_Start, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.Joystick_Touch_Move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.Joystick_Touch_End, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.Joystick_Touch_End, this);
    
        // Initially hide or position the joystick off-screen
        // this.node.setPosition(offScreenPosition);
        // OR
        this.JoystickNode.active = false;
    }

    public IsOn() : boolean {
        return this.isOn;
    }

    public TurnOn() {
        this.isOn = true;
    }

    public  TurnOff(){
        this.isOn = false;
    }

    private Joystick_Touch_Start(event: cc.Event.EventTouch): void {
        if(!this.isOn) return;

        let touch_pos = event.getLocation();
        let world_pos = this.node.convertToNodeSpaceAR(touch_pos);
    
        this.JoystickNode.setPosition(world_pos);
        this.JoystickNode.active = true;
    }

    private Joystick_Touch_Move(event: cc.Event.EventTouch): void {
        if(!this.isOn) return;

        let touch = event.getTouches()[0];
        let touch_pos = touch.getLocation();
        // Convert the touch position to the JoystickNode's local space
        let local_touch_pos = this.JoystickNode.convertToNodeSpaceAR(touch_pos);
    
        // Limit the joystick vector based on the joystick's max radius
        let limitedVector = this.Limit_joystick_Vector(local_touch_pos);
        this.Set_Joystick_Ball_Position(limitedVector); // Pass the limited vector for setting position
        this.Joystick_Vector = limitedVector;
    }

    private Joystick_Touch_End(): void {
        this.Joystick_Vector = cc.Vec3.ZERO;
        this.Set_Joystick_Ball_Position(cc.Vec3.ZERO);
        this.JoystickNode.active = false; // Make the whole joystick disappear after lifting the finger
    }

    private Set_Joystick_Ball_Position(pos: cc.Vec3): void {
        if(!this.isOn) return;
        this.Joystick_Ball.setPosition(pos);
    }

    private Limit_joystick_Vector(joystick_vector: cc.Vec3): cc.Vec3 {
        if(!this.isOn) return new cc.Vec3(0,0,0);

        let input_mag = joystick_vector.mag();
        if (input_mag > this.Joystick_Max) {
            // Create a new limited vector without modifying the original joystick_vector
            return joystick_vector.normalize().mul(this.Joystick_Max);
        }
        return joystick_vector;
    }
}
