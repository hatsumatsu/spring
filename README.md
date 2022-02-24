```

```

Vanilla JS spring-interpolated vaules.

Heavily based on https://github.com/asbjornh/tiny-spring.

### Installation

`npm install @superstructure.net/spring`

> Note: This library comes as es6 module only.
> If you use a transpiler like babel or swc make sure to include `/node_modules/@superstructure.net/spring` in your transpiler’s config.

### Usage

```js
import Spring from '@superstructure.net/spring';

// create spring
const x = new Spring(
    0, // initial value
    {
        stiffness: 40,
        damping: 5,
        mass: 2,
        precision: 100,
    }
);

// set value
x.transition(100);

// set value immediately without transition
x.set(100);

// get current value
x.get();

// subscribe to hooks
x.onUpdate((value) => {
    // ...
});

x.onRest((value) => {
    // ...
});

// clean up...
x.destroy();
```

By default each spring runs its own animation loop via `requestAnimationFrame`. If you have a lot of springs you might achieve better performance by manually implementing a single animation frame instead of using `onUpdate()`.

```js
// create spring
const x = new Spring(
    0,
    springConfig,
    false // IMPORTANT! Omit internal animation loop
);

function onFrame() {
    // set value
    x.transition(100);

    // update spring
    x.update();

    // do what you would otherwise do in onUpdate()
    const _x = x.get();

    requestAnimationFrame(onFrame);
}

onFrame();
```
