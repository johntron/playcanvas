pc.script.attribute('speed', 'number', 80);
pc.script.create('drive', function (context) {
    // Creates a new Drive instance
    var Drive = function (entity) {
        console.log(entity.findByName("Cylinder"));
        this.entity = entity;
        this.hit = false;
    };

    Drive.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            var rb = this.entity.rigidbody;
            if (context.keyboard.wasPressed(pc.KEY_SPACE)) {
                rb.teleport(0, 0, 0, 0, 0, 0);
                rb.linearVelocity = pc.Vec3.ZERO;
                rb.angularVelocity = pc.Vec3.ZERO;
                this.hit = false;
            }
            
            if (this.hit) {
                return;
            }
            
            rb.applyImpulse(0, 0, -this.speed, 0, 0, 0);
            rb.applyTorqueImpulse(0, this.speed, 0);
            this.hit = true;
        }
    };

    return Drive;
});