pc.script.create('input', function (context) {
    var SPEED = 5;
    var JUMP_IMPULSE = 400;
    
    var origin = new pc.Vec3();
    var groundCheckRay = new pc.Vec3(0, -0.51, 0);
    var rayEnd = new pc.Vec3();
    
    var Input = function (entity) {
        this.entity = entity;
        this.speed = SPEED;
        this.jumpImpulse = new pc.Vec3(0, JUMP_IMPULSE, 0);
            
        this.onGround = true;

        this.x = new pc.Vec3();
        this.z = new pc.Vec3();
        this.heading = new pc.Vec3();

        this.controller = new pc.input.Controller(window);
        this.controller.registerKeys('forward', [pc.input.KEY_UP, pc.input.KEY_W]);
        this.controller.registerKeys('back', [pc.input.KEY_DOWN, pc.input.KEY_S]);
        this.controller.registerKeys('left', [pc.input.KEY_LEFT, pc.input.KEY_A, pc.input.KEY_Q]);
        this.controller.registerKeys('right', [pc.input.KEY_RIGHT, pc.input.KEY_D]);
        this.controller.registerKeys('jump', [pc.input.KEY_SPACE]);
    };


    Input.prototype = {
        initialize: function () {
            this.camera = context.root.findByName('Camera');
            context.keyboard.on(pc.input.EVENT_KEYDOWN, this.onKeyDown, this);
        },
        
        //prevents default browser actions, such as scrolling when pressing cursor keys
        onKeyDown: function (event) {
            event.event.preventDefault();
        },

        update: function (dt) {
            var input = false;

            // Calculate the camera's heading in the XZ plane
            var transform = this.camera.getWorldTransform();

            transform.getZ(this.z);
            this.z.y = 0;
            this.z.normalize();            
            
            transform.getX(this.x);            
            this.x.y = 0;
            this.x.normalize();            
            
            this.heading.set(0, 0, 0);

            // Strafe left/right
            if (this.controller.isPressed('left')) {
                this.heading.sub(this.x);                
                input = true;
            } else if (this.controller.isPressed('right')) {
                this.heading.add(this.x);                
                input = true;
            }
            
            // Move forwards/backwards
            if (this.controller.isPressed('forward')) {
                this.heading.sub(this.z);                
                input = true;
            } else if (this.controller.isPressed('back')) {
                this.heading.add(this.z);
                input = true;
            }

            if (input) {
                this.heading.normalize();                
            }

            this.move(this.heading);

            if (this.controller.wasPressed('jump')) {
                this.jump();
            }
            
            this._checkGround();
        },
            
        /**
        * Move the character in the direction supplied
        */
        move: function (direction) {
console.log(this.onGround);
            if (this.onGround) {
                this.entity.rigidbody.activate();
                direction.scale(this.speed);
                this.entity.rigidbody.linearVelocity = direction;
            }
        },
        
        rotate: function (angles) {
            this.entity.setEulerAngles(angles);
        },
        
        /**
        * Make the character jump
        */
        jump: function () {
            if (this.onGround) {
                this.entity.rigidbody.activate();
                this.entity.rigidbody.applyImpulse(this.jumpImpulse, origin);
                this.onGround = false;                
            }
        },
        
        /**
        * Check to see if the character is standing on something
        */
        _checkGround: function () {
            var self = this;
            var pos = this.entity.getPosition();
            rayEnd.add2(pos, groundCheckRay);            
            self.onGround = false;

            // Fire a ray straight down to just below the bottom of the rigid body, 
            // if it hits something then the character is standing on something.
            context.systems.rigidbody.raycastFirst(pos, rayEnd, function (result) {
                self.onGround = true;
            });
        }
    }

    return Input;
});