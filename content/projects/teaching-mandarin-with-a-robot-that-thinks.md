# Teaching Mandarin with a Robot That Thinks

## Summary

Capstone project at SUNY Polytechnic Institute's Instructional Design and Technology program, developed through AIXLab with support from a New York State grant. The project explores whether an embodied AI tutor can teach Mandarin Chinese more effectively than a screen-based agent by combining voice interaction, embodied presence, and agentic lesson orchestration on a Reachy Mini desktop robot.

## Context

I believe in building this work in public because research becomes more useful when the process is visible, including the false starts and constraints. This project sits at the intersection of AI, robotics, and education, and asks how second-language acquisition theory can be translated into a working embodied system for learning and teaching.

At the center of the capstone is a simple question: can a physical robot tutor Mandarin Chinese more effectively than a screen-based assistant? Human-Robot Interaction research suggests that embodiment changes attention, engagement, and social presence, and those effects may be especially important in tonal language learning where prosody and mouth shape carry meaning.

## Challenge

Language pedagogy and robotics rarely share the same design space, so the challenge was to make second-language acquisition theory, human-robot interaction literature, and real hardware constraints operate as one coherent system.

The technical work required careful orchestration across speech recognition, language generation, pronunciation-aware feedback, robot gesture control, and face-directed gaze. Onboard compute is limited, so latency management became a core design problem. Mandarin tone recognition also introduced audio-processing constraints that needed custom filtering even with Reachy Mini's four-microphone array.

## What I Built

- Designed an embodied AI tutoring concept for Mandarin Chinese using Reachy Mini.
- Built an agentic workflow that listens to learner speech, generates pedagogically sequenced prompts, adapts lesson difficulty, and coordinates spoken feedback with gesture and gaze.
- Used MuJoCo simulation to test dialogue timing, branching behavior, and error recovery.
- Incorporated expert review from a Mandarin-speaking teacher to validate instructional logic, vocabulary sequencing, and feedback quality.
- Framed the capstone as a Research through Design project where the prototype itself serves as a design argument.

## Discovery

The discovery phase brought together second-language acquisition theory, Human-Robot Interaction literature, and the platform constraints of Reachy Mini. I used that framing to define a research direction that was educationally meaningful, technically plausible, and appropriate for a capstone investigation.

## Build

The system runs as an agentic tutoring loop. Speech recognition captures learner audio, a large language model generates context-aware Mandarin prompts, the system evaluates learner attempts, adjusts the next step, and drives robot behavior in real time. Rather than following a rigid script, the tutor adapts to each exchange and uses embodied cues to support the lesson.

## Launch

Because the project was scoped as Research through Design, I excluded live human-subject testing and instead created four detailed learner personas for simulation-based evaluation in MuJoCo. A Mandarin teacher consultant reviewed the instructional logic and feedback quality, and the final capstone was delivered as a technical design portfolio with a clear path toward future efficacy testing.

## Body

When I joined the Instructional Design and Technology program at SUNY Polytechnic Institute, I was drawn to the edges of the field, the places where learning theory bumps into engineering. Enrolling in the AIXLab, and securing a New York State grant to fund the work, gave me the runway to pursue something genuinely novel: an embodied AI system for second-language instruction.

The project centers on a deceptively simple question: can a physical robot tutor Mandarin Chinese more effectively than a screen-based agent? The hypothesis draws on Human-Robot Interaction research, which consistently shows that embodiment, a body that gestures, turns, and occupies shared space, activates different attentional and social mechanisms in learners than text or voice alone. For tonal language acquisition like Mandarin, where prosody and mouth shape carry meaning, that physical presence may matter more than for other languages.

"Embodiment activates social mechanisms in learners that a screen simply cannot replicate, and for tonal languages, that difference may be decisive."

The platform I chose is the Reachy Mini, a compact desktop humanoid from Pollen Robotics with a four-microphone array, a 5W speaker, and a full Python SDK. It is small enough to sit on a student's desk, expressive enough to carry a conversational lesson, and open enough to integrate a full AI stack. Within it runs an agentic workflow: a speech recognition module pipes audio to a large language model that dynamically generates pedagogically sequenced Mandarin prompts, evaluates pronunciation attempts, adjusts difficulty in real time, and drives the robot's gestures and gaze without a rigid script. The loop closes on every utterance.

The technical constraints shaped every design decision. Onboard compute is limited, so latency management between the LLM API calls, audio pipeline, and motor commands required careful orchestration. Tone recognition for Mandarin, four lexical tones plus a neutral, demands audio preprocessing that consumer microphones handle poorly. The four-mic array helps, but the signal chain still required custom filtering. Localising the robot's head gaze to a learner's face in real time added a computer-vision dependency that had to be balanced against the processing budget.

Because the project is framed as a Research through Design investigation, a methodology that treats the prototype itself as a knowledge claim, human subjects testing was deliberately excluded from scope. Instead, I designed four detailed learner personas covering a range of Mandarin proficiency levels and learning styles, then ran simulation-based evaluations in the Reachy Mini's MuJoCo environment to stress-test timing, dialogue branching, and error-recovery behavior. A Mandarin-speaking teacher consultant reviewed the instructional logic, vocabulary sequencing, and feedback quality, grounding the pedagogical claims without requiring IRB review.

What this capstone ultimately demonstrates is not just a working prototype, but a design argument: that agentic AI, thoughtfully orchestrated inside an embodied platform, can instantiate second-language acquisition principles such as comprehensible input, corrective feedback, and interactional scaffolding in a form factor that travels to the learner's desk. The next step, now clearly scoped, is a formal efficacy study. The machine is ready to teach.

## Outcome

The result is a working embodied AI tutoring prototype and a validated design argument: agentic AI can be orchestrated inside a physical platform to deliver learning principles like comprehensible input, corrective feedback, and interactional scaffolding at the learner's desk.

The next step is a formal efficacy study with real learners. The prototype is already strong enough to demonstrate system behavior, instructional intent, and the practical design constraints involved in building embodied AI for education.

## Stack

Reachy Mini, embodied AI, Mandarin instruction, voice interfaces, agentic workflows, Human-Robot Interaction, Research through Design, MuJoCo simulation, second-language acquisition theory, AIXLab, SUNY Polytechnic IDT

## Q&A

### What is this project?

This is a SUNY Polytechnic Institute IDT capstone project exploring an embodied AI Mandarin tutor built through AIXLab with support from a New York State grant.

### Why teach Mandarin with a robot?

The project investigates whether a physically embodied tutor can create stronger engagement, attention, and learning support than a screen-based agent, especially for a tonal language where voice and physical presence matter.

### What role does Reachy Mini play?

Reachy Mini is the physical tutoring platform. It provides the robot body, microphones, speaker, motion system, and Python SDK needed to deliver conversational lessons with gesture and gaze.

### What makes the system agentic?

The tutor does not follow a fixed script. It dynamically sequences prompts, reacts to learner input, adjusts difficulty, and coordinates multiple components across speech, language generation, and robot behavior.

### How was the project evaluated?

It was evaluated through four simulated learner personas in MuJoCo and through expert consultation with a Mandarin-speaking teacher, rather than through live human-subject testing.

### Why was there no live user study?

The capstone was intentionally scoped as a Research through Design investigation, so the prototype and its design rationale were the core contribution. That made simulation and expert review a better fit than an IRB-dependent human-subject study.

### What does this project prove?

It demonstrates that embodied AI can be used to operationalize language-learning principles such as scaffolding, corrective feedback, and adaptive interaction in a desk-scale robot format.

### What comes next?

The next step is a formal efficacy study with real learners to test whether the embodied tutoring approach improves language outcomes in practice.
