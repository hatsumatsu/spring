/**
 * Vanilla JS spring-interpolated values.
 *
 *
 */

export default class Spring {
    constructor(initialPosition = 0, { stiffness = 200, damping = 10, precision = 100, mass = 1 } = {}, run = true) {
        this.frame = null;
        this.frameTime = performance.now();

        this.stiffness = stiffness;
        this.damping = damping;
        this.precision = precision;
        this.mass = mass;
        this.run = run;

        this.position = initialPosition;
        this.endPosition = 0;
        this.velocity = 0;

        this.callbacks = {
            onUpdate: (v) => {},
            onRest: (v) => {},
        };

        this.isRested = true;
    }

    interpolate(time = performance.now()) {
        const distance = this.endPosition - this.position;
        const acceleration = (this.stiffness * distance) / this.mass - this.damping * this.velocity;

        const newVelocity = this.velocity + acceleration * ((time - (this.frameTime || performance.now())) / 1000);
        const newPosition = this.position + newVelocity * ((time - (this.frameTime || performance.now())) / 1000);

        // velocity smaller than 1 / precision OR new distance smaller than 1 / precision
        const isRested =
            Math.abs(newVelocity) < 1 / this.precision && Math.abs(newPosition - this.endPosition) < 1 / this.precision;

        this.position = isRested ? this.endPosition : newPosition;
        this.velocity = newVelocity;

        if (!isRested) {
            this.callbacks.onUpdate(this.position);
        } else {
            if (!this.isRested) {
                this.callbacks.onRest(this.position);
            }
        }

        this.isRested = isRested;

        if (this.run && !isRested) {
            cancelAnimationFrame(this.frame);
            this.frame = requestAnimationFrame((time) => {
                this.interpolate(time);
            });
        }

        // null frame time on rest so we can start with a fresh cycle...
        this.frameTime = isRested ? null : time;
    }

    transition(v = 0) {
        this.endPosition = v;

        if (this.run) {
            this.interpolate();
        }
    }

    set(v = 0) {
        const changed = v !== this.endPosition;

        this.position = this.endPosition = v;

        if (changed) {
            this.callbacks.onUpdate(this.position);
        }
    }

    get() {
        return this.position;
    }

    update() {
        if (this.run) {
            console.warn(`Don't use update when run = true`);
            return;
        }

        this.interpolate();
    }

    onUpdate(fn = (v) => {}) {
        this.callbacks.onUpdate = fn;

        this.callbacks.onUpdate(this.position);
    }

    onRest(fn = (v) => {}) {
        this.callbacks.onRest = fn;
    }

    destroy() {
        cancelAnimationFrame(this.frame);

        this.callbacks = {};
    }
}
