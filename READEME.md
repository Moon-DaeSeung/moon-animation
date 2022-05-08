# Moon-Animation
storybook: https://moon-daeseung.github.io/moon-animation

Hi
This is Moon-UI
This library is inspired by react-spring. react-spring is the library that implements animation through damped occiliation equation. react-moon can be configured with any equation of motion including free fall, cycloid and moon's orbital motion.
Of course, it can mimic spring motion. so react-moon has own Spring component. its configuration and implementation are slightly different from react-spring's. (react-moon has no dependency for react-spring.)

react-spring's components consist of Moon, Spring, Transition. Moon is the base component of other components. you can create any movement by configuring equation of motion to Moon. Spring is configured by "'from value' and 'to value'" that trigger animation. you can update 'to value' in Spring. Spring remember all moving things' movement infomation(displacement, velocity). so any changed is updated smoothly (incluing animated element's count)

The last one, Transtion is the most versatile component. it extends functionalty of css transition. css transtion only work at continuos value(like width, translate ...) Transition can make css's transtion effect for non continous css value that includes 'flex-direction','gird-col'. you can change placement of items just by changing those css value. As you can see, making change of placement is usually implemented by 'transform: translate(...)'. this implementation need to caluate translation amount in order to move element properly. that can be tricky (considering responsive view, it's even more difficult) but don't worry. Transtion can help you to make animation without considering complicated calculation.