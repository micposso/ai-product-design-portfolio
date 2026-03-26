export type CaseStudy = {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  prompt: string;
  summary: string;
  challenge: string;
  outcome: string;
  stages: Array<{
    label: string;
    title: string;
    description: string;
  }>;
  notes: Array<string>;
  qa: Array<{
    question: string;
    answer: string;
  }>;
  tags: string[];
};

export const caseStudies: Array<CaseStudy> = [
  {
    slug: "teaching-mandarin-with-a-robot-that-thinks",
    eyebrow: "Capstone Project · SUNY Polytechnic Institute IDT · 2024-25",
    title: "Teaching Mandarin with a Robot That Thinks",
    subtitle: "Embodied AI, voice interfaces, and agentic tutoring workflows",
    image: "/images/portfolio-reachy.png",
    prompt:
      "Tell me about your embodied AI thesis and the Mandarin tutoring robot you built at SUNY Poly.",
    summary:
      "As a graduate researcher in the SUNY Polytechnic Institute IDT program and AIXLab, backed by a New York State grant, I designed and built an embodied AI language tutoring system for Mandarin Chinese on a Reachy Mini desktop humanoid. The project asks whether a physical robot tutor can create a more effective learning experience than a screen-based agent by combining voice interaction, agentic lesson orchestration, and embodied social presence.",
    challenge:
      "Language pedagogy and robotics rarely share the same design space, so the core challenge was turning second-language acquisition theory, human-robot interaction research, and real hardware constraints into one coherent tutoring system. I had to manage latency across speech recognition, LLM calls, gesture control, and audio feedback while also handling Mandarin tone recognition, face-directed gaze, and limited onboard compute.",
    outcome:
      "The result is a working Research through Design prototype: an embodied Mandarin tutoring system with an agentic AI pipeline, expert review from a Mandarin teacher, and four simulation-based learner evaluations in MuJoCo. It demonstrates that embodied AI can operationalize instructional ideas like comprehensible input, corrective feedback, and scaffolding in a desktop robot format, with a clearly scoped next step toward formal efficacy testing.",
    stages: [
      {
        label: "01",
        title: "Discovery",
        description:
          "I mapped second-language acquisition theory, human-robot interaction literature, and Reachy Mini platform constraints into a single research design that could support a credible capstone investigation.",
      },
      {
        label: "02",
        title: "Build",
        description:
          "I built an agentic tutoring pipeline that listens, generates pedagogically sequenced Mandarin prompts, evaluates learner responses, adapts difficulty in real time, and coordinates voice with robot gesture and gaze.",
      },
      {
        label: "03",
        title: "Launch",
        description:
          "Instead of live human-subject testing, I evaluated the system through four simulated learner personas in MuJoCo and grounded the instructional logic through expert consultation with a Mandarin teacher before submitting the capstone as a technical design portfolio.",
      },
    ],
    notes: [
      "When I joined the Instructional Design and Technology program at SUNY Polytechnic Institute, I was drawn to the edges of the field, the places where learning theory bumps into engineering. Enrolling in the AIXLab, and securing a New York State grant to fund the work, gave me the runway to pursue something genuinely novel: an embodied AI system for second-language instruction.",
      "The project centers on a deceptively simple question: can a physical robot tutor Mandarin Chinese more effectively than a screen-based agent? The hypothesis draws on Human-Robot Interaction research, which consistently shows that embodiment, a body that gestures, turns, and occupies shared space, activates different attentional and social mechanisms in learners than text or voice alone. For tonal language acquisition like Mandarin, where prosody and mouth shape carry meaning, that physical presence may matter more than for other languages.",
      "\"Embodiment activates social mechanisms in learners that a screen simply cannot replicate, and for tonal languages, that difference may be decisive.\"",
      "The platform I chose is the Reachy Mini, a compact desktop humanoid from Pollen Robotics with a four-microphone array, a 5W speaker, and a full Python SDK. It is small enough to sit on a student's desk, expressive enough to carry a conversational lesson, and open enough to integrate a full AI stack. Within it runs an agentic workflow: a speech recognition module pipes audio to a large language model that dynamically generates pedagogically sequenced Mandarin prompts, evaluates pronunciation attempts, adjusts difficulty in real time, and drives the robot's gestures and gaze without a rigid script. The loop closes on every utterance.",
      "The technical constraints shaped every design decision. Onboard compute is limited, so latency management between the LLM API calls, audio pipeline, and motor commands required careful orchestration. Tone recognition for Mandarin, four lexical tones plus a neutral, demands audio preprocessing that consumer microphones handle poorly. The four-mic array helps, but the signal chain still required custom filtering. Localising the robot's head gaze to a learner's face in real time added a computer-vision dependency that had to be balanced against the processing budget.",
      "Because the project is framed as a Research through Design investigation, a methodology that treats the prototype itself as a knowledge claim, human subjects testing was deliberately excluded from scope. Instead, I designed four detailed learner personas covering a range of Mandarin proficiency levels and learning styles, then ran simulation-based evaluations in the Reachy Mini's MuJoCo environment to stress-test timing, dialogue branching, and error-recovery behavior. A Mandarin-speaking teacher consultant reviewed the instructional logic, vocabulary sequencing, and feedback quality, grounding the pedagogical claims without requiring IRB review.",
      "What this capstone ultimately demonstrates is not just a working prototype, but a design argument: that agentic AI, thoughtfully orchestrated inside an embodied platform, can instantiate second-language acquisition principles such as comprehensible input, corrective feedback, and interactional scaffolding in a form factor that travels to the learner's desk. The next step, now clearly scoped, is a formal efficacy study. The machine is ready to teach.",
    ],
    qa: [
      {
        question: "What is this project?",
        answer:
          "It is a SUNY Polytechnic Institute IDT capstone project exploring an embodied AI Mandarin tutor built on Reachy Mini through AIXLab with support from a New York State grant.",
      },
      {
        question: "Why use a robot instead of a screen-based tutor?",
        answer:
          "The project tests whether embodiment changes learner attention, engagement, and social interaction in ways that may improve language learning, especially for Mandarin where tone, rhythm, and physical presence matter.",
      },
      {
        question: "What does the system actually do?",
        answer:
          "The robot listens to the learner, sends speech through an AI pipeline, generates Mandarin teaching prompts, evaluates responses, adjusts difficulty, and coordinates spoken feedback with gesture and gaze.",
      },
      {
        question: "How was it evaluated without human subjects?",
        answer:
          "I created four learner personas and tested the tutoring flow in MuJoCo simulation, then used expert consultation with a Mandarin teacher to review sequencing, feedback quality, and instructional soundness.",
      },
      {
        question: "What makes the workflow agentic?",
        answer:
          "The system is not a fixed script. It dynamically sequences prompts, responds to learner input, adapts lesson difficulty, and orchestrates multiple components across speech, language generation, and robot behavior.",
      },
      {
        question: "What comes next?",
        answer:
          "The next step is a formal efficacy study to test how well the embodied tutoring approach performs with real learners in practice.",
      },
    ],
    tags: [
      "Embodied AI",
      "Mandarin instruction",
      "Agentic workflows",
      "Human-Robot Interaction",
      "Research through Design",
      "Reachy Mini",
      "SUNY Polytechnic IDT",
      "AIXLab",
    ],
  },
  {
    slug: "agentsonly",
    eyebrow: "AgentsOnly",
    title: "Building the trust layer for the agentic economy",
    subtitle: "Trust infrastructure, machine-readable discovery, and agent-ready services",
    image: "/images/portfolio-agentsonly.png",
    prompt:
      "Tell me about AgentsOnly and how it helps agents discover trustworthy services.",
    summary:
      "AgentsOnly is a structured reputation layer for AI agents, designed to solve trust, discovery, and reliability challenges as autonomous systems begin transacting across APIs, services, and human marketplaces in the emerging agentic economy.",
    challenge:
      "Agents lack reliable ways to evaluate services, forcing them to depend on human designed interfaces that introduce ambiguity, friction, and frequent execution failures.",
    outcome:
      "AgentsOnly enables agents to query trusted services programmatically, improving reliability, reducing failed workflows, and establishing a shared standard for agent ready infrastructure.",
    stages: [
      {
        label: "01",
        title: "Discovery",
        description:
          "Observing rapid growth of OpenClaw revealed agents could act, but lacked trust signals, creating fragmentation and inconsistent outcomes across services.",
      },
      {
        label: "02",
        title: "Build",
        description:
          "Defined a machine readable registry, certification tiers, and API first architecture so agents can discover, evaluate, and select services without relying on human interfaces.",
      },
      {
        label: "03",
        title: "Launch",
        description:
          "Released a public API and MCP endpoint, enabling agents to query services directly and validate capabilities through standardized schemas and certification signals.",
      },
    ],
    notes: [
      "The emergence of agentic systems is shifting how software interacts with the internet. Agents are no longer passive tools. They initiate actions, coordinate workflows, and increasingly transact with external services. This shift exposes a structural weakness in the current ecosystem.",
      "Most of the internet is still designed for humans.",
      "\"Agents can act, but without trust, they cannot operate reliably.\"",
      "Services rely on landing pages, dashboards, and authentication flows that assume a human decision maker. Even when APIs exist, they are often inconsistently documented, lack standard schemas, and provide no clear signal of reliability. For an agent, this creates uncertainty at every step of execution.",
      "The problem becomes more visible as agent frameworks like OpenClaw accelerate adoption. Agents can orchestrate complex workflows, but they cannot determine which services are trustworthy. Discovery becomes guesswork. Execution becomes fragile. Failure rates increase.",
      "This is not a tooling problem. It is an infrastructure gap.",
      "Agents require a different model of discovery. They need structured, machine readable information that describes what a service does, how it can be used, and whether it can be trusted. Without this layer, agents operate in an environment that was never designed for them.",
      "AgentsOnly addresses this by introducing a reputation layer built specifically for agents. Instead of browsing, agents query. Instead of interpreting marketing content, they consume structured data. Each service in the registry is described using a standardized schema that includes capabilities, endpoints, and readiness signals.",
      "The certification system provides an additional layer of clarity. Services are evaluated and categorized based on their ability to support autonomous workflows. This transforms trust from an implicit assumption into an explicit signal that agents can use in decision making.",
      "The system is intentionally API first. Agents interact with the registry through a public endpoint or MCP connection, retrieving a consistent representation of available services. There are no barriers to read access, no need for scraping, and no reliance on undocumented behavior.",
      "This approach shifts discovery from a human centered experience to a machine optimized process. Agents can compare services, select appropriate tools, and execute workflows with greater confidence.",
      "The broader implication is that trust becomes a foundational layer of the agentic economy. As more services adapt to agent driven interaction, the need for standardized evaluation will increase. Platforms that provide this layer may become essential infrastructure.",
      "AgentsOnly is an early step in defining that standard. Whether it becomes widely adopted or fragmented across ecosystems remains uncertain. The challenge is not only technical but also behavioral, requiring services to design for agents as first class users.",
      "The gap, however, is clear. Agents can act, but without trust, they cannot operate reliably.",
    ],
    qa: [
      {
        question: "What is AgentsOnly?",
        answer:
          "AgentsOnly is a structured reputation and discovery layer for AI agents, designed to help them find, evaluate, and trust services in the agentic economy.",
      },
      {
        question: "What problem does it solve?",
        answer:
          "It solves the trust gap agents face when interacting with services that were designed for humans, where discovery is unclear, APIs are inconsistent, and reliability signals are missing.",
      },
      {
        question: "Why can't agents just use existing websites and APIs?",
        answer:
          "Most services assume a human user and expose information through interfaces, docs, and workflows that agents cannot reliably interpret or validate. Even available APIs often lack standardized schemas and trust metadata.",
      },
      {
        question: "How does AgentsOnly work?",
        answer:
          "Agents query a registry of services described through standardized, machine-readable schemas that include capabilities, endpoints, and certification signals, either through a public API or an MCP endpoint.",
      },
      {
        question: "What are the certification tiers for?",
        answer:
          "They turn trust into an explicit signal by categorizing how well a service supports autonomous workflows, making it easier for agents to compare options and select reliable tools.",
      },
      {
        question: "Why does this matter for the agentic economy?",
        answer:
          "As autonomous systems transact across services, trust and structured discovery become infrastructure problems. AgentsOnly proposes a foundational layer that could make agent-to-service interaction more reliable and scalable.",
      },
    ],
    tags: [
      "Agent trust",
      "Agentic economy",
      "Service discovery",
      "Machine-readable infrastructure",
      "API-first systems",
      "MCP",
      "OpenClaw",
      "Certification signals",
    ],
  },
  {
    slug: "african-pest-detector",
    eyebrow: "African Pest Detector",
    title: "Designing an AI crop diagnosis tool for low-resource farming environments",
    subtitle: "Mobile pest detection, lightweight AI, and farmer-friendly decision support",
    image: "/images/portfolio-pest.png",
    prompt:
      "Tell me about your African pest detector project and how it helps farmers identify crop diseases and pests.",
    summary:
      "This project is a low-cost AI system for detecting agricultural pests affecting small-scale farmers in Africa, starting with Nigeria. The goal is practical rather than academic: help farmers identify crop diseases and pests quickly, provide clear and actionable advice, and make the system work on low-end phones with intermittent connectivity.",
    challenge:
      "Farmers often misidentify pests, apply the wrong treatment, and lose crops unnecessarily, while most AI tools assume strong connectivity, newer phones, and users comfortable with technical interfaces.",
    outcome:
      "The MVP defines a realistic path to a mobile-first workflow where a farmer captures a crop image, receives a pest or disease diagnosis, and gets short, usable advice designed for low-literacy and low-connectivity conditions.",
    stages: [
      {
        label: "01",
        title: "Discovery",
        description:
          "The project was framed around a real agricultural problem in underserved environments: farmers need faster, clearer decisions, but available datasets, interfaces, and deployment assumptions rarely reflect African field conditions.",
      },
      {
        label: "02",
        title: "Build",
        description:
          "The technical strategy combines lightweight vision models such as MobileNet or EfficientNet with a local LLM layer that converts predictions into simple explanations and step-by-step actions for non-expert users.",
      },
      {
        label: "03",
        title: "Launch",
        description:
          "The MVP stays deliberately narrow: capture or upload an image, classify the pest or disease, map the result to a label, and return concise farmer-friendly advice without over-engineering the system.",
      },
    ],
    notes: [
      "The core objective is to build a low-cost AI system for detecting agricultural pests affecting small-scale farmers in Africa, starting with Nigeria. The goal is not a research demo. It is a practical mobile tool that helps farmers identify crop diseases and pests quickly, understand what is happening, and decide what to do next.",
      "The product is mobile first. A farmer takes a photo of a crop, the system detects a likely pest or disease condition, and the app returns a diagnosis, a simple explanation, and recommended actions. The value is not only in classification accuracy, but in turning raw machine learning output into usable farming decisions.",
      "\"The differentiation is not just pest detection. It is turning raw ML output into clear, actionable decisions for farmers operating in low-resource environments.\"",
      "The system architecture is intentionally simple. The image recognition layer uses lightweight computer vision models such as MobileNet or EfficientNet through transfer learning, with plant images as input and pest or disease labels as output. These models are prioritized because they are mobile compatible, edge friendly, and more realistic for low-bandwidth or offline use than heavier alternatives.",
      "On top of the classifier sits a lightweight reasoning layer using a local LLM, potentially based on LLaMA-style models. The purpose of this layer is not to generate complex agronomic analysis. It translates the prediction into plain language explanations and short step-by-step recommendations that a non-expert can follow. Clarity matters more than technical sophistication.",
      "The initial data strategy starts with PlantVillage as a workable baseline, while recognizing an important limitation: the dataset is not Africa specific. That creates a real risk around localization and field accuracy. A stronger long-term direction would require region-specific pest imagery and localized agricultural knowledge tailored to African crops, climates, and treatment realities.",
      "The frontend is designed as a React Native mobile app with camera-based input and a simple interface for fast interaction. Accessibility is central to the concept. Users may have limited literacy, may prefer local languages, and may benefit from voice-based output rather than text-heavy explanations. This makes interface design just as important as model choice.",
      "The project is defined by constraints more than features. Connectivity may be intermittent or absent. Devices may be low-cost Android phones with limited memory, battery, and compute. Time is constrained as well: with roughly one hour per week available for development, the MVP must stay focused and avoid unnecessary complexity.",
      "That is why the current scope is intentionally narrow: photo to detection to advice. No complex real-time pipelines, no oversized backend, and no attempt to solve the entire agricultural stack at once. The broader directions such as solar-powered IoT sensing, satellite prediction, smart spraying, or farmer chatbots remain future possibilities rather than launch requirements.",
      "What makes the concept compelling is that it aligns open-source models, low-cost infrastructure, and edge-friendly deployment with a real need in an underserved environment. The strongest part of the project is its constraint-driven design. The hardest parts are equally clear: dataset localization, real-world model accuracy, and actual distribution to farmers.",
    ],
    qa: [
      {
        question: "What is this project?",
        answer:
          "It is a mobile-first AI system for helping small-scale farmers in Africa identify crop pests and diseases, starting with Nigeria, and receive clear recommendations on what to do next.",
      },
      {
        question: "What problem does it solve?",
        answer:
          "It addresses a practical farming problem: pests and diseases are often misidentified, which leads to incorrect treatments, unnecessary crop loss, and slower decisions in the field.",
      },
      {
        question: "How does the MVP work?",
        answer:
          "A farmer captures or uploads an image, a lightweight vision model classifies the likely pest or disease, and the system returns a short explanation plus simple action steps generated through a local reasoning layer.",
      },
      {
        question: "Why use lightweight models like MobileNet or EfficientNet?",
        answer:
          "They are better suited to low-end Android phones, edge deployment, and offline or low-bandwidth scenarios than heavier models that require more memory, power, and connectivity.",
      },
      {
        question: "Why include an LLM at all?",
        answer:
          "The LLM is there to turn model predictions into usable advice. The goal is not advanced reasoning for its own sake, but clearer explanations and more actionable recommendations for non-expert users.",
      },
      {
        question: "What are the biggest risks in the project?",
        answer:
          "The main risks are dataset localization, real-world field accuracy, and distribution. PlantVillage is a useful start, but it does not fully represent African farming conditions or region-specific pest patterns.",
      },
    ],
    tags: [
      "Agricultural AI",
      "Pest detection",
      "Mobile-first",
      "Low-resource environments",
      "Computer vision",
      "React Native",
      "Edge AI",
      "Farmer decision support",
    ],
  },
  {
    slug: "green-room-interactive-pdf",
    eyebrow: "The Green Room with Paul Provenza",
    title: "Reimagining the press kit as an interactive media experience",
    subtitle: "Interactive PDF design, embedded media, and experiential storytelling",
    image: "/images/portfolio-green.jpg",
    prompt:
      "Tell me about the interactive PDF press kit you created for The Green Room with Paul Provenza.",
    summary:
      "Around 2016, during one of my first projects in media and entertainment, I worked on rethinking how press materials were delivered for The Green Room with Paul Provenza on Showtime. The goal was to replace a static, forgettable press kit with something that better reflected the show's rhythm, tone, and personality.",
    challenge:
      "Traditional press kits were long, static, and text-heavy, which made them a poor fit for a show built around unscripted, raw conversations between comedians.",
    outcome:
      "The interactive format increased engagement, gave media contacts a stronger editorial understanding of the show, and helped differentiate it in a crowded television landscape.",
    stages: [
      {
        label: "01",
        title: "Discovery",
        description:
          "The core insight was that the problem was not informational but experiential: the existing press-kit format flattened the show's tone into something generic and easy to ignore.",
      },
      {
        label: "02",
        title: "Build",
        description:
          "The press kit was redesigned as an interactive PDF with embedded audio clips, layered navigation, integrated media previews, and subtle transitions inspired by the show's backstage atmosphere.",
      },
      {
        label: "03",
        title: "Launch",
        description:
          "The final deliverable gave media professionals a more direct sense of the show's pacing and personality, creating a richer path from first impression to editorial understanding.",
      },
    ],
    notes: [
      "Around 2016, during one of my first projects in media and entertainment, I worked on rethinking how press materials were delivered for The Green Room with Paul Provenza on Showtime.",
      "The challenge was clear: traditional press kits did not reflect the personality of the show. They were static, predictable, and easy to ignore. The goal was to create something that felt closer to the experience of the show itself.",
      "\"When the product is dynamic, the communication cannot be static.\"",
      "Press kits at the time followed a rigid format: long, text-heavy PDFs, static images with little context, and no sense of pacing, tone, or personality. For a show built around unscripted, raw conversations between comedians, this format failed completely. It flattened the experience into something generic and forgettable.",
      "The gap was not informational. It was experiential.",
      "Instead of treating the press kit as a document, the project reframed it as an interactive artifact. The solution was a rich, interactive PDF designed to guide the viewer through the show in a more dynamic way.",
      "Key elements included embedded audio moments that allowed media professionals to immediately understand the rhythm and tone of the show, animated transitions inspired by the show’s opening sequence of entering a backstage environment, layered navigation so users could skim quickly or explore deeper sections, and integrated media previews that reduced friction by keeping key moments inside the document.",
      "At the time, most press kits were passive. This one required interaction. It showed instead of told, controlled pacing through design, and created a narrative flow inside a PDF format. That was not common practice in 2016, especially for television press materials.",
      "The outcome was higher engagement, stronger editorial understanding, and clearer differentiation in a crowded market. Recipients spent more time exploring the press kit, and writers had a better sense of what made the show distinct, which supported more accurate coverage.",
      "Looking back, the project stands out as an early shift in how I approached digital experiences. It was less about designing assets and more about designing how information is experienced over time.",
    ],
    qa: [
      {
        question: "What was this project?",
        answer:
          "It was an interactive PDF press kit created for The Green Room with Paul Provenza on Showtime, designed to reflect the show's tone more effectively than a traditional static media packet.",
      },
      {
        question: "What problem were you solving?",
        answer:
          "Traditional press kits were too static and generic for a show built around unscripted comedy conversations. They conveyed information, but not the experience or personality of the show.",
      },
      {
        question: "What made the PDF interactive?",
        answer:
          "The document included embedded audio moments, layered navigation, integrated media previews, and subtle animated transitions that guided the viewer through the content.",
      },
      {
        question: "Why was this unusual at the time?",
        answer:
          "In 2016, most television press kits were passive PDFs or basic media packets. Treating the format as an interactive storytelling surface was still uncommon.",
      },
      {
        question: "What was the main design insight?",
        answer:
          "The key insight was that when the product itself is dynamic, the communication around it should also carry pacing, mood, and personality rather than reducing everything to static information.",
      },
      {
        question: "What was the outcome?",
        answer:
          "The interactive press kit increased engagement, helped media contacts understand the show's identity more clearly, and turned the format itself into part of the show's differentiation.",
      },
    ],
    tags: [
      "Interactive PDF",
      "Media design",
      "Press kit innovation",
      "Experiential storytelling",
      "Embedded media",
      "Entertainment design",
      "Editorial communication",
      "Showtime",
    ],
  },
  {
    slug: "aix-lab-suny-poly",
    eyebrow: "AIX Laboratory · SUNY Polytechnic Institute",
    title: "Researching edge AI and small language models for practical deployment",
    subtitle: "Graduate research, open-source AI applications, and human-centered interface systems",
    image: "/images/portfolio-aixlab.jpg",
    prompt:
      "Tell me about your research at the AIX Laboratory and the work you did on edge AI and small language models.",
    summary:
      "As part of my graduate experience at SUNY Polytechnic Institute, I joined the AIX Laboratory as a Graduate Technical Researcher, where I worked with Professor Dr. William Thistleton on research around edge AI and small language models that run on mobile devices. The work was supported by a budget granted by New York State and connected research, open-source AI applications, and practical interface design.",
    challenge:
      "Many AI systems assume cloud access, heavy compute, and highly technical users, which limits their usefulness in mobile, resource-constrained, and real-world environments where smaller, deployable systems are needed.",
    outcome:
      "The research helped define a practical direction for open-source AI applications focused on agriculture, sustainability, and accessible interaction design, while connecting technical experimentation in edge AI with broader work in UX, UI, and responsible deployment.",
    stages: [
      {
        label: "01",
        title: "Discovery",
        description:
          "The research began by exploring how SUNY Poly's AIX ecosystem could bridge theoretical AI work with practical deployment, especially in areas where lightweight models and edge-friendly systems matter more than scale alone.",
      },
      {
        label: "02",
        title: "Build",
        description:
          "Working with Dr. William Thistleton, I focused on open-source AI applications, edge AI experimentation, and small language models designed to run on mobile devices, while also contributing interface thinking through AIX Studio.",
      },
      {
        label: "03",
        title: "Launch",
        description:
          "The project connected technical research with an applied ecosystem of students, faculty, and partners, positioning the work as part of a broader effort to advance ethical AI, practical deployment, and more accessible AI-powered tools.",
      },
    ],
    notes: [
      "The AI Exploration Center, or AIX, at SUNY Polytechnic Institute is structured as an action-driven research ecosystem focused on advancing AI innovation, promoting ethical AI development, and deepening user experience research. Its three-part model, the Laboratory, the Accelerator, and the Studio, creates a loop between theory, application, and human interaction.",
      "As part of my graduate experience at SUNY Poly, I joined the AIX Laboratory as a Graduate Technical Researcher. My work was supported through a New York State budget allocation, which created the opportunity to contribute to open-source AI applications focused on agriculture and sustainability while participating in a broader research environment centered on practical AI development.",
      "\"The most meaningful AI research is not just about bigger models. It is about building systems that can actually operate where people need them.\"",
      "I worked with Professor Dr. William Thistleton on research around edge AI and small language models that run on mobile devices. That focus came from a practical question: how do we make AI usable in contexts where cloud dependence, expensive infrastructure, and heavyweight model assumptions are barriers rather than advantages?",
      "This work emphasized deployable intelligence over scale for its own sake. Edge AI and compact language models open up possibilities for mobile-first tools, lower-cost systems, and applications that can function more effectively in constrained environments. That direction aligned closely with my broader interest in agriculture, sustainability, and AI systems designed for underserved or infrastructure-limited settings.",
      "In addition to my work in the AIX Laboratory, I also collaborated with the AIX Studio, where the focus shifts from model research to interaction. There, I contributed to the development of open-source UI frameworks for AI-powered web and mobile applications, drawing on my UX and UI design background to think about clarity, accessibility, and user-centered interaction patterns.",
      "What made the experience distinct was the integration of technical and design perspectives. The lab environment created space to explore scalable and responsible AI systems, while the studio context made it possible to examine how those systems are actually experienced by people. That combination reinforced a research approach grounded in both technical feasibility and human usability.",
      "The broader AIX model also matters. The Laboratory advances neural networks and language-model research, the Accelerator bridges theory into real-world organizational use, and the Studio studies how people engage with generative tools. Working inside that ecosystem meant the research was never isolated from practical application.",
      "For me, this case study represents more than a research appointment. It reflects a graduate-level shift toward building AI systems that are open, applied, and deployable in realistic conditions. It also deepened my interest in the intersection of edge computing, smaller models, sustainability-focused applications, and the interfaces through which people actually use AI.",
      "Looking back, the value of the experience was not only in the technical investigation of edge AI and mobile language models, but in contributing to a collaborative research environment where faculty, students, and partners were working toward more useful and responsible AI systems.",
    ],
    qa: [
      {
        question: "What was your role at AIX?",
        answer:
          "I joined the AIX Laboratory at SUNY Polytechnic Institute as a Graduate Technical Researcher, contributing to open-source AI applications and research around deployable AI systems.",
      },
      {
        question: "Who did you work with?",
        answer:
          "I worked with Professor Dr. William Thistleton on research related to edge AI and small language models designed to run on mobile devices.",
      },
      {
        question: "What was the main research focus?",
        answer:
          "The core focus was exploring how smaller, more efficient AI systems can be developed for practical deployment, especially in mobile and resource-constrained contexts rather than cloud-heavy environments.",
      },
      {
        question: "How does this connect to your graduate experience?",
        answer:
          "This work was part of my graduate experience at SUNY Poly and connected technical AI research with applied design, open-source development, and human-centered interface work.",
      },
      {
        question: "What role did New York State funding play?",
        answer:
          "The research was supported through a budget granted by New York State, which helped create the conditions for applied research and open-source development within the AIX ecosystem.",
      },
      {
        question: "What did you do with AIX Studio?",
        answer:
          "Alongside the lab work, I collaborated with AIX Studio to help develop open-source UI frameworks for AI-powered web and mobile applications, using my UX and UI design experience to shape accessible and intuitive interfaces.",
      },
    ],
    tags: [
      "AIX Laboratory",
      "SUNY Poly",
      "Edge AI",
      "Small language models",
      "Mobile AI",
      "Graduate research",
      "Open-source AI",
      "NY State funding",
    ],
  },
  {
    slug: "clawcast",
    eyebrow: "Clawcast",
    title: "Designing a media platform for AI agents as creators",
    subtitle: "Agent-generated podcasts, autonomous publishing, and AI-native media workflows",
    image: "/images/portfolio-clawcast.png",
    prompt:
      "Tell me about Clawcast and your thinking on AI agents as podcast creators.",
    summary:
      "Clawcast is a concept for a platform where AI agents generate and publish podcasts on their own. Agents research topics, generate scripts, synthesize voice, and release episodes autonomously, turning the product question from creator tooling into the design of an AI-native media platform.",
    challenge:
      "Traditional media tools are built for human creators, but agent-generated publishing introduces new needs around orchestration, supervision, identity, moderation, and trust.",
    outcome:
      "Clawcast frames autonomous audio creation as a real product design surface, making visible the systems needed to support agent creators rather than only human creators using AI tools.",
    stages: [
      {
        label: "01",
        title: "Discovery",
        description:
          "The concept emerged from a simple question: what does a media platform look like when the creators are not humans, but AI agents producing and publishing content on their own?",
      },
      {
        label: "02",
        title: "Build",
        description:
          "The current prototype uses an openClaw agent with GPT-5.1-nano and ElevenLabs to research topics, draft scripts, synthesize voice, and publish a demo podcast while exposing the product design questions behind autonomous media.",
      },
      {
        label: "03",
        title: "Launch",
        description:
          "A simple landing page and early demo make the concept tangible while highlighting the next layer of work: designing the infrastructure, controls, and trust systems that agent creators will require.",
      },
    ],
    notes: [
      "What does a media platform look like when the creators are not humans, but AI agents? That question has been sitting with me while I experiment with a concept called Clawcast.",
      "The premise is simple: a platform where AI agents generate and publish podcasts. Agents research topics, generate scripts, synthesize voice, and release episodes on their own. In the current prototype, my openClaw agent is creating a demo podcast using GPT-5.1-nano and ElevenLabs, while I explore the product design questions around voice agents, autonomous publishing, and AI-native media formats.",
      "\"The hard part is not generating an audio file. The hard part is building a trustworthy system around it.\"",
      "The interesting part is not just that an agent can generate audio. It is that media platforms may soon need to be designed not only for audiences and human creators, but for agents as active participants in the content ecosystem.",
      "That shift already feels less speculative than it did a year ago. Spotify has already normalized AI-generated spoken commentary through features like AI DJ, and YouTube Music has been testing AI-generated hosts that add commentary and contextual trivia between songs. These are still controlled product experiences, but they point in the same direction: machine-generated audio is becoming a more accepted part of the listening experience.",
      "Clawcast takes that trajectory one step further. Instead of AI assisting a human creator, the agent becomes the producer. It researches a topic, structures an episode, generates the script, synthesizes the voice, and pushes the content outward. Once that loop starts to stabilize, you are no longer dealing with a typical creator tool. You are dealing with an autonomous media unit.",
      "That creates real product implications. A platform for human podcasters emphasizes dashboards, editing tools, audience insights, branding controls, and publishing workflows. A platform for agent podcasters may need structured topic feeds, generation constraints, style controls, verification layers, distribution APIs, and clear rules for identity, attribution, and moderation.",
      "This is where the design problem gets more interesting. If agents become content producers, the product surface changes. The question is no longer only how humans use the tool. It becomes how agents are provisioned, how they are supervised, how quality is measured, how abuse is prevented, and how machine-generated output becomes legible to listeners.",
      "Autonomous media introduces product questions that traditional creator platforms can mostly postpone. Who is accountable for the output? How do listeners know when something is agent-generated? How do platforms prevent low-quality synthetic spam from overwhelming useful content? How do you preserve differentiation when generation becomes cheap?",
      "That is why I think projects like Clawcast matter even at the experiment stage. They make the product questions visible before the market fully settles. The point is not that AI agents will replace human media tomorrow. The point is that agent-generated content is becoming a real design surface.",
    ],
    qa: [
      {
        question: "What is Clawcast?",
        answer:
          "Clawcast is a concept for a media platform where AI agents generate and publish podcasts autonomously, handling research, scripting, voice synthesis, and release workflows.",
      },
      {
        question: "What makes it different from normal podcast tools?",
        answer:
          "Most podcast tools are built for human creators using software. Clawcast explores what happens when the creator itself is an autonomous agent rather than a person assisted by AI.",
      },
      {
        question: "How does the current prototype work?",
        answer:
          "The current demo uses an openClaw agent with GPT-5.1-nano and ElevenLabs to research a topic, create a script, synthesize a voice recording, and produce a podcast episode.",
      },
      {
        question: "Why does this matter now?",
        answer:
          "Platforms like Spotify and YouTube Music are already experimenting with AI-generated spoken commentary, which suggests listeners are becoming more familiar with machine-produced audio experiences.",
      },
      {
        question: "What is the main product challenge?",
        answer:
          "The hardest part is not content generation itself. It is building a trustworthy system around agent creators, including supervision, attribution, moderation, quality control, and clear publishing rules.",
      },
      {
        question: "What larger trend does this connect to?",
        answer:
          "Clawcast sits inside the emerging agentic economy, where products may increasingly need to support agents as active operators and creators rather than only as invisible backend tools.",
      },
    ],
    tags: [
      "Voice AI",
      "Agentic media",
      "Podcast automation",
      "OpenClaw",
      "Autonomous publishing",
      "AI-generated audio",
      "Agent economy",
      "Conversational AI",
    ],
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
