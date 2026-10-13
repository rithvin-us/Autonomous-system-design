# Speaking script — System Design & Architecture in Autonomous Systems

Audience: first-year engineering students. Running time: about 58 minutes.

**How to read this script**

- **[click]** means press Next on the clicker. Every cue matches a build on the slide.
- **Design lens** is the system-design idea to land on each slide. This is the thread of the lecture: an autonomous machine is a *designed system*, not a pile of parts.
- Times are guides. The spoken text is a starting point; say it in your own words.

The recurring vocabulary, which you can introduce on slide 2 and reuse throughout:

| Term | Meaning, in one line |
| --- | --- |
| Requirement | What the system must do, and how well, before any parts are chosen |
| Subsystem | A part of the system with one clear job |
| Interface | The agreed way two subsystems exchange data or power |
| Data flow | The path information takes from sensing to action |
| Trade-off | Gaining one quality by giving up another |
| Failure mode | A way the system can go wrong, and what it does when it does |
| Verification | Showing, with evidence, that the system meets its requirements |

---

## 01 · System Design & Architecture in Autonomous Systems · 1 min

Good morning. Today is not a lecture about robots. It is a lecture about **systems**: how engineers take sensors, computers, software and motors, each of which works fine on its own, and design them into one machine that can act on its own.

The vehicle behind me is the kind of thing we will build up, piece by piece. By the end, you should be able to look at any autonomous machine and ask the questions a system designer asks: What does it need to know? Where does that information flow? What decides? What acts? And what happens when something fails?

**Design lens:** an autonomous machine is a designed system. Hold on to that idea for the rest of the lecture.

---

## 02 · What are autonomous systems? · 2 min

An autonomous system perceives its surroundings, makes decisions, and acts, with limited human intervention. "Limited" matters: most real systems still have people supervising, setting goals, or ready to stop them.

Every autonomous machine, whatever it looks like, is made of three kinds of subsystem.

**[click]** **Sensors.** These measure the world and the machine itself. On this vehicle: a stereo camera on the mast, a radar at the front, a GNSS antenna on the roof, ultrasonic sensors on the bumper, and an IMU inside.

**[click]** **Computing.** The onboard computer turns raw measurements into decisions. It is the only part that "thinks", and it never touches the world directly.

**[click]** **Actuators.** The steering and drive motors. They are the only parts that change the world.

**Design lens:** sensors, computing and actuators are separate subsystems with separate jobs. A system designer's first act is this split, because it lets each part be designed, built and tested on its own and then joined through clear interfaces.

---

## 03 · Automation vs. autonomy · 2 min

These two words are often confused. Look at both sides running normally. On the left, a conveyor press. It pushes every two seconds, exactly on a timer. On the right, a mobile robot driving from start to goal.

**[click]** Now put something unexpected in both. The press does not know the object is there. It has no sensor, so it follows its sequence and jams. The robot sees the obstacle, re-plans and goes round. And each time the obstacle moves, it picks a different way.

Automation follows **fixed instructions**. Autonomy makes **decisions based on conditions it measures**.

**Design lens:** the difference starts as a **requirement**. "Must work when the environment changes" forces you to add sensing, decision-making and a feedback path. Those three additions are what the rest of this lecture is about. Automation is the right answer when conditions are controlled; autonomy costs more and is only worth it when they are not.

---

## 04 · Types of autonomous systems · 2 min

Autonomous systems come in very different shapes.

**[click]** **Autonomous vehicles**, like this robotaxi. Notice the sensor tower on the roof and the sensor pods at each corner.

**[click]** **Mobile robots** in warehouses: a large unit that lifts shelves and a small one that carries parts, with laser scanners near the floor.

**[click]** **Drones**, here with an automatic docking station that charges them and protects them from the weather.

**[click]** **Robotic machines** that work alongside or in place of people, including humanoid robots.

Different bodies, different speeds, different environments. But underneath, every one of them has the same structure: **sense, decide, act**.

**Design lens:** this is why architecture matters. Learn the architecture once and you can reason about any of these machines. The parts change; the structure does not.

---

## 05 · The autonomy loop · 2 min

Here is that structure as a loop. A pulse goes round it continuously, many times a second.

**[click]** **Sense.** Measure the world and the vehicle's own motion.

**[click]** **Perceive.** Turn raw numbers into meaning: "there is an obstacle three metres ahead".

**[click]** **Decide.** Choose what to do about it: "steer left around it".

**[click]** **Act.** Move the steering and motors. And because the vehicle moved, the world it senses has changed, so the loop repeats.

**Design lens:** this is a **closed loop**. Its speed is a design requirement. If the loop runs ten times a second, the vehicle can react no faster than a tenth of a second, plus however long each stage takes. System designers budget that time across the stages, so slow perception or slow planning directly limits how fast the vehicle can safely drive.

---

## 06 · Autonomous system architecture · 3 min

This is the most important diagram in the lecture. It is the architecture: the blocks, and the direction information flows between them.

**[click]** **Sensors** produce raw data.

**[click]** **Computing** turns that data into two things. **Perception** answers "what is around me?". **Localisation** answers "where am I?".

**[click]** **Planning** uses both answers to choose a route and a behaviour.

**[click]** **Control** turns that plan into exact speed and steering commands. Notice it also receives localisation directly, because it needs to know where the vehicle actually is, moment to moment.

**[click]** **Hardware**, the actuators, moves the vehicle. The dashed line along the bottom is the physical world: moving changes what the sensors measure next.

**Design lens:** every arrow is an **interface**: an agreement about what data is sent, in what form, and how often. Good architecture keeps blocks loosely coupled. You can replace the radar, or improve the planner, without redesigning everything else, as long as the interfaces stay the same.

---

## 07 · Sensors and data · 2 min

The architecture starts with its inputs. These are the five sensors we will look at in turn.

**[click]** **Stereo camera**: images, plus depth.
**[click]** **Radar**: distance and relative speed.
**[click]** **GNSS**: position on Earth.
**[click]** **IMU**: the vehicle's own acceleration and rotation.
**[click]** **Ultrasonic**: short distances, close to the vehicle.

Notice that they answer *different questions*. No single sensor answers all of them.

**Design lens:** sensors are chosen from **requirements**, not the other way round. "Detect a pedestrian at 30 metres at night in rain" leads to different sensors from "park within 10 centimetres of a wall". The models are shown at similar sizes here; in reality the IMU is the size of a fingernail and the camera is the width of a hand.

---

## 08 · ZED 2i stereo camera · 3 min

This is the stereo camera used on our vehicle. Let's walk round it.

**[click]** **Left camera**: a wide-angle lens and image sensor.
**[click]** **Right camera**: the second one, exactly 120 mm away. That distance is called the **baseline**.
**[click]** The **aluminium enclosure** is sealed against dust and water, which matters outdoors.
**[click]** At the back, a **USB 3.0 Type-C** connector with locking screws, so vibration cannot shake the cable loose.
**[click]** **Mounting points** at the back, and **[click]** a standard tripod thread on the base.

**[click]** Now, depth. Both cameras look at the same point. When the point is near, the two lines of sight meet at a wide angle; when it is far, the angle is narrow. From that angle and the known baseline, the camera estimates distance.

**Design lens:** two design details here are pure system engineering. The **locking connector** exists because interfaces fail mechanically before they fail electrically. And the **baseline is a trade-off**: a wider baseline measures far objects better but makes the camera bigger and worse up close.

---

## 09 · Starkenn radar · 2–3 min

The radar on our vehicle. The model on screen is a placeholder until we have the exact unit's drawings, so treat its shape as generic.

**[click]** The **sensing face**, or radome: radio waves leave and return through it.
**[click]** The **housing**.
**[click]** The **mounting bracket**.
**[click]** The **connector**.

**[click]** Watch the field in front. Radar sends out radio waves; objects reflect them back. The time delay gives **distance**, and the shift in frequency of the echo gives **relative speed**. That is why one target is labelled approaching and the other moving away. The range shown is representative, not this product's specification.

**Design lens:** radar's strength is that it **keeps working in rain, fog and darkness**, where a camera struggles. Its weakness is coarse detail: it knows something is there and how fast it is moving, but not what it is. That gap is exactly why we combine sensors.

---

## 10 · GNSS · 2–3 min

GNSS, the family of satellite systems that includes GPS.

**[click]** The **antenna**, under a protective dome.
**[click]** The **ground plane** base, which helps reject signals reflected from below.
**[click]** The **coaxial cable**.
**[click]** The **receiver module**, which turns satellite signals into a position.
**[click]** The **data connector** to the onboard computer.

**[click]** The receiver measures how long signals take to arrive from several satellites. It needs at least four to solve for its position and its own clock error. Notice one satellite is blocked by the building. Here we have exactly four left, the bare minimum.

**Design lens:** GNSS gives **absolute** position, which no other sensor here can. But it depends on something outside your system: a clear view of the sky. Under trees, between buildings, indoors or in tunnels, accuracy drops or disappears. A good design never trusts a single source for position.

---

## 11 · IMU · 2 min

The inertial measurement unit.

**[click]** The **IMU chip**: an accelerometer and a gyroscope in one package.
**[click]** **Axis markings**: the directions it measures along.
**[click]** **Mounting holes**: the board must be fixed rigidly, or it measures its own wobble instead of the vehicle's motion.
**[click]** **Connector pins**: power in, data out.
**[click]** The **circuit board**.

**[click]** Watch it move. The orange arrow and bar show **acceleration**; the curved arrow and second bar show **angular velocity**, how fast it is turning.

**Design lens:** the IMU is fast and works anywhere, with no outside signal. But to get position from acceleration you add it up over time, and every small error adds up too. Within seconds or minutes the estimate drifts. So the IMU is excellent for short-term motion, and is paired with GNSS or other sensors to correct the drift. That pairing is a classic system design pattern.

---

## 12 · Ultrasonic sensor · 2 min

The simplest sensor on the vehicle, an HC-SR04 style module.

**[click]** **T**, the transmitter, and **[click]** **R**, the receiver.
**[click]** A **crystal oscillator** that provides precise timing.
**[click]** Four **pins**: power, trigger, echo, ground.
**[click]** **Mounting holes**, and **[click]** the **driver circuitry** on the back.

**[click]** The transmitter sends a burst of ultrasound. It reflects off the wall and returns to the receiver. The module times the round trip. Distance is speed of sound times echo time, divided by two, because the sound travels there *and back*. Sound travels at about 343 metres per second in air at 20 °C.

**Design lens:** cheap, simple and reliable at short range, so it is ideal for the last metre: parking and close obstacles. But it is slow and short-ranged, and soft or angled surfaces absorb the echo. Fit-for-purpose beats most powerful.

---

## 13 · Choosing the right sensor · 3 min

Here are all five as coverage around the vehicle: radar long and narrow, the camera wide and medium, ultrasonic short fans at the corners, the GNSS link to the sky, and the IMU inside.

**[click]** **Night.** The camera, which relies on light, drops out. Radar, ultrasonic, GNSS and the IMU carry on.

**[click]** **Fog or heavy rain.** The camera is weakened; radar is barely affected.

**[click]** **No open sky**: a tunnel, a car park, dense trees. GNSS is lost; the others carry on.

No single condition defeats every sensor, and no single sensor survives every condition.

**Design lens:** this is **sensor fusion as a design decision**. You choose a set of sensors whose weaknesses do not overlap, so that in every expected condition at least one can still do each job. That is called **redundancy**, and it is chosen deliberately, from the conditions in your requirements.

---

## 14 · Jetson Orin: the onboard computer · 3 min

The sensors give us data; something has to turn that data into decisions. On our vehicle that is an NVIDIA Jetson Orin. This model follows the Jetson Orin Nano Developer Kit.

**[click]** The **Jetson module** itself: an Arm CPU and an NVIDIA GPU on one small board. This is where perception, localisation and planning run.
**[click]** The **heatsink and fan**. Running neural networks and planners continuously makes heat; without cooling, the chip slows itself down.
**[click]** **USB 3.2 ports**: where the stereo camera and other sensors plug in.
**[click]** **Gigabit Ethernet**: for networked sensors and other computers.
**[click]** **CSI camera connectors**: direct camera inputs with very little delay.
**[click]** The **40-pin expansion header**: serial, I²C, SPI and general-purpose pins. This is how it talks to the microcontroller that drives the motors.
**[click]** **Power input**.
**[click]** **Storage** underneath, for the software, maps and recorded data.

**[click]** Now watch the data flow. Sensor data streams in through the ports, the module processes it, and commands leave through the header to the microcontroller.

**Design lens:** the computer is a subsystem with its own requirements, not a magic box. Does it have **enough processing** for every input at the required loop rate? Can we supply its **power** and remove its **heat** on a vibrating vehicle? Does it have the right **interfaces**, the right number and type of ports, for every sensor and for the controller? Answering those is a system-design decision made before the computer is bought.

---

## 15 · Localisation and mapping · 3 min

Two questions the robot must keep answering: *where am I?*, which is localisation, and *what is around me?*, which is mapping.

Watch the grey cells appear: that is the map being built as the sensors see each part of the building. The orange ring is the robot's **uncertainty** about its own position. It grows while the robot drives on motion estimates alone, and shrinks sharply when it recognises a **landmark** it has seen before.

**[click]** Focus on **localisation**: the ring and the landmark sightings.

**[click]** Focus on **mapping**: the map itself, which planning will use next.

**Design lens:** the system does not just store a position; it stores a position **and how sure it is**. Downstream blocks should use that uncertainty. A planner should be more cautious when the ring is large. Passing confidence across an interface, not just a number, is a mark of good system design.

---

## 16 · Decision-making and planning · 2 min

Planning answers: where should I go, and how?

We have a start, a goal and an obstacle.

**[click]** The planner considers several **possible routes**: over the top, straight through, and underneath. Straight through is blocked.

**[click]** It **chooses** one by comparing costs: length, distance from obstacles, comfort, rules of the road. Here, the lower route is short and clear.

**[click]** The robot drives the chosen route.

**Design lens:** a planner is defined by its **cost function**: what the designers decided matters. Change the costs and the "best" route changes. Those priorities, such as safety first, then time, then comfort, come from the system requirements, not from the algorithm.

---

## 17 · Control systems · 3 min

The planner says where to go. Control makes the vehicle actually go there.

The dashed line is the **desired** path; the orange line is what the robot **actually** drives. The arrow between them is the **error**.

Below is the **feedback loop**: take the desired path, compare it with the measured position, let the controller compute a correction, apply it to the robot, measure again.

**[click]** Cut the feedback. The robot follows its commands blindly, a small disturbance builds up, and it drifts away from the path. Nothing notices.

**[click]** Restore the feedback. It measures its error and corrects, settling back onto the path.

**Design lens:** feedback is how a system tolerates the things you cannot model: wind, slopes, worn tyres, a heavy load. But it depends entirely on **measurement**. If the sensor in the feedback path is wrong or late, the controller confidently corrects towards the wrong answer. Control quality is limited by sensing quality and timing.

---

## 18 · Hardware and computing · 3 min

Now the physical chain from sensing to motion.

The **sensor**, our stereo camera, sends images to the **onboard computer**, an NVIDIA Jetson Orin, which runs perception and planning. It sends commands to a **low-level controller**, a microcontroller, which drives the **motor driver**, which switches power to the **actuators**: steering and drive motors.

**[click]** **USB 3.0**: high bandwidth for images.
**[click]** **Serial or CAN**: short commands, sent reliably.
**[click]** **PWM**: precisely timed signals.
**[click]** **Power**: the only link carrying real energy.

**[click]** The **emergency stop** sits on the power line itself, not in software. Press it and the motors lose power whatever the computers are doing.

**Design lens:** this is **hardware partitioning**. The Jetson is powerful but runs a full operating system, so its timing is not perfectly predictable. The microcontroller is simple, but its timing is exact. So each job goes where it fits: thinking on the computer, timing-critical signals on the microcontroller, energy through the driver. Neither board on its own is "the controller"; the system is.

---

## 19 · Software architecture and ROS 2 · 3 min

The software mirrors the architecture. Each block on the top row is a **separate program**: drivers for each sensor, perception, localisation, planning, control, and the motor interface.

Watch the orange messages. No program talks to another directly. Each message drops into **ROS 2**, a communication layer, and rises out of it to whichever program needs it.

**[click]** The **components**: small, single-purpose programs.
**[click]** **ROS 2**: the shared communication layer underneath them all.
**[click]** It runs on a **Linux operating system**,
**[click]** on the **onboard computer**.

**Design lens:** this is **modularity**. Because components only meet through ROS 2, you can restart one, replace one, or test one on its own with recorded data, without touching the others. One crashing program does not take the rest down. That is how large teams build large robots in parallel.

---

## 20 · How components communicate · 2 min

A closer look at that communication. Four nodes, each a separate program: a sensor node, a processing node, a planning node and a control node.

Each sends **messages** on a **named channel**. ROS 2 calls these channels *topics*. Any node that needs the data listens to the channel; the sender does not need to know who is listening.

**[click]** **Images**, from the camera node to perception.
**[click]** **Detected obstacles**, from perception to planning.
**[click]** **Planned path**, from planning to control.
**[click]** **Speed and steering**, from control out to the motor hardware.

**Design lens:** each channel is an **interface contract**: its name, the format of each message, and how often it is sent. Agree those first and teams can build their nodes independently. Change one carelessly and something else breaks quietly. In real projects, interface definitions are some of the most carefully reviewed documents.

---

## 21 · System integration · 3 min

Here are the subsystems as layers: actuators and vehicle at the bottom, then communication interfaces, computing, software, and sensors on top. Together, one unit.

**[click]** Pulled apart: each layer is usually built by a different person or team, and each can pass its own tests in isolation.

**[click]** Brought back together. Integration is making the connections between layers work, shown lit in orange, with data running through the whole stack.

**Design lens:** integration is where most problems appear, because it is the first time the **assumptions** of different teams meet. Units disagree, timing differs, a connector is wired differently. Good practice is to integrate **early and often**, one interface at a time, rather than everything at the end.

---

## 22 · Safety and failure handling · 3 min

Everything fails eventually. Design decides what happens next.

The robot drives normally; all its sensors are healthy.

**[click]** The camera signal is lost. The system's health monitoring **detects the fault**. Notice the robot does not just carry on as if nothing happened.

**[click]** It moves to a **safe state**: it slows, stops, and turns its hazard lights on. For this vehicle, stopped is safe. For a drone in the air it would not be, and that is a design decision.

**[click]** And separately, the **independent emergency stop**: a hardware circuit that removes motor power directly. It does not depend on any software being correct.

**Design lens:** list the **failure modes** early, and design a response to each: detect, then reach a safe state. And never let the last line of defence depend on the thing that might have failed. That is why the emergency stop is hardware.

---

## 23 · Simulation and testing · 3 min

How do we know the system meets its requirements before we trust it with real hardware and people? We test it, much of it first in simulation.

Here is a simulated robot. The requirement under test: always stop at least the **safe limit** away from an obstacle. The graph plots distance to the obstacle over time, against that limit.

Scenario one: obstacle on a straight. It sees it early, brakes gently, and **passes**.

**[click]** Scenario two: obstacle just after a bend. The bend hides it until late, the robot stops too close, and the test **fails**. That is a success for testing: we found the problem on a screen, not on a road. The fix might be slower cornering, a wider sensor view, or harder braking: a design change.

**[click]** Scenario three: the camera drops out mid-run. The robot treats it as a fault and stops early. **Pass**.

**Design lens:** this is **verification**. Every requirement needs a test that can pass or fail, and a list of scenarios that tries to break the design, especially the edge cases. Simulation makes those tests cheap, fast and repeatable; hardware trials then confirm the simulation was right.

---

## 24 · Case study: lane-following robot · 3 min

Now let's put the whole architecture to work on one task: staying in a lane.

**[click]** **Sense**: the camera sees the lane lines ahead.
**[click]** **Estimate**: from those lines, how far the robot is from the lane centre. This is relative position: it does not need GNSS, only where it is *relative to the lane*.
**[click]** **Plan**: a target point on the centre line, a little way ahead.
**[click]** **Control**: a steering correction towards that point.
**[click]** **Actuate**: the steering turns the wheels, and the orange line shows the path it actually drives.

Then the loop runs again, many times a second.

**Design lens:** look at the **requirement** first: "stay within the lane at this speed". That one sentence sets how far ahead the camera must see, how fast the loop must run, and how quickly the steering must respond. Requirements flow down through every block.

---

## 25 · Case study: obstacle avoidance · 3 min

The whole manoeuvre first: driving, an obstacle in the lane, a smooth pass on the left. Now slowly.

**[click]** **Sense**: the radar detects an object ahead.
**[click]** **Understand**: the lane is blocked, and the space on the left is free.
**[click]** **Decide**: two options, stop or pass on the left. Passing is chosen.
**[click]** **Control**: steer left and slow down.
**[click]** **Move**: the vehicle follows the new path.

**Design lens:** notice how many subsystems had to work, in order, within a fraction of a second, and how each depends on the one before. If perception is slow, the decision comes too late; if the free-space estimate is wrong, the right decision is made on wrong information. End-to-end behaviour is a property of the **whole system**, not of any single part.

---

## 26 · One system. Many components. · 2 min

Sensing, computing, planning, control and hardware. Each one is a serious engineering subject in its own right. But autonomy does not live in any one of them. It **emerges** from how they work together: the interfaces between them, the timing of the loop, how they handle failure, and how well the whole has been tested.

That is the job of system design and architecture: to start from requirements, divide the problem into subsystems, define how they talk, choose the trade-offs, plan for failure, and prove it works.

Next time you see a robot vacuum, a delivery drone or a self-driving car, ask the system designer's questions: what does it sense, what decides, what acts, how do the parts talk, and what happens when something fails?

Thank you.

---

## 27 · Conclusion & Q&A

Outro animation video ("That's the end of our presentation. Any questions?").
Open the floor for questions and discussion from the audience.

---

## Appendix: the system-design thread, slide by slide

| Slide | Design idea |
| --- | --- |
| 02 | Decompose into subsystems |
| 03 | Requirements drive architecture |
| 04 | One architecture across many machines |
| 05 | Closed loops and timing budgets |
| 06 | Architecture, data flow, interfaces |
| 07–12 | Choose components from requirements; every sensor is a trade-off |
| 13 | Redundancy and sensor fusion |
| 14 | Computing is a subsystem: processing, power, heat and interfaces |
| 15 | Pass uncertainty across interfaces |
| 16 | Cost functions encode priorities |
| 17 | Feedback depends on measurement |
| 18 | Hardware partitioning by timing and power |
| 19 | Modularity |
| 20 | Interface contracts |
| 21 | Integrate early and often |
| 22 | Failure modes and safe states |
| 23 | Verification against requirements |
| 24–25 | End-to-end behaviour of the whole system |
| 26 | Autonomy emerges from the system |
| 27 | Outro & audience Q&A |
