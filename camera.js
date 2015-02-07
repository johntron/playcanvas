pc.script.create('first_person_camera', function (context) {
    var FirstPersonCamera = function (entity) {
        this.entity = entity;
        
        // Camera euler angle rotation around x and y axes
        this.ex = 0;
        this.ey = 0;

        // Disabling the context menu stops the browser displaying a menu when 
        // you right-click the page
        context.mouse.disableContextMenu();
        context.mouse.on(pc.input.EVENT_MOUSEMOVE, this.onMouseMove, this);
        context.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onMouseDown, this);
        
    };

    FirstPersonCamera.prototype = {
        initialize: function () {
            this.controller = context.root.findByName('Player').script.input;
        },
        
        update: function (dt) {
            // Update the camera's orientation
            this.entity.setEulerAngles(this.ex, this.ey, 0);
//             var angles = this.entity.getEulerAngles().clone();
//             angles.y *= 10;
// console.log(angles);
//             this.controller.rotate(angles);
        },
    
        onMouseMove: function (event) {
            // Update the current Euler angles, clamp the pitch.
            this.ex -= event.dy / 5;
            this.ex = pc.math.clamp(this.ex, -90, 90);
            this.ey -= event.dx / 5;
        },
        
        onMouseDown: function (event) {
            // When the mouse button is clicked try and capture the pointer
            if (!pc.input.Mouse.isPointerLocked()) {
                context.mouse.enablePointerLock();    
            }            
        }
    };

   return FirstPersonCamera;
});