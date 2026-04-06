# What travel reveals about reliable agentic systems
Category: AI Product Strategy
Image Note: View of Split from Marjan Park.
Published At: April 6, 2026
Read Time: 5 min read
Prompt: What did traveling in Split teach you about reliable agentic systems?
Image: /images/view-on-split.jpg

## Excerpt

My take on why travel is a useful stress test for agentic systems, why orchestration matters more than a single smart model, and where voice still fits as an experimental fallback when APIs fail.

## Content

While traveling in Split, I used the environment as a constraint to evaluate what makes agentic systems reliable. Travel introduces a specific class of problems that expose the limits of most AI systems: information is fragmented, often outdated, and highly dependent on time, place, language, and local context. In Split, those constraints became especially visible. Croatian content had to be translated, business hours shifted around holidays and weekends, and places that appeared open online were sometimes closed in reality or operating on reduced schedules that were not reflected in any API or website. Even the cultural texture mattered, from how locations were described to how businesses communicated availability.

Accuracy becomes difficult to maintain when the underlying data cannot be trusted.

Location services such as Google Maps provide a strong foundation, but they are not sufficient. While they offer coordinates, routing, and estimated walking times, their business metadata is frequently incomplete or stale. An agent relying only on this layer will often produce plans that look correct but fail in execution.

"Planning a family trip can easily turn into hours of research, constant checking, and second guessing. Automating that process with a personal travel agent changes the experience entirely."

To address this, the system was designed as a multi agent architecture coordinated through a scheduler. A planning agent generates a daily itinerary based on location and constraints. A places agent retrieves points of interest and restaurants. A navigation agent calculates walking distances using mapping APIs. A translation agent processes Croatian content into English. These components operate as a continuous workflow, updating throughout the day rather than responding to isolated prompts.

![Diagram of the travel agentic workflow](/images/travel-agentic-workflow-diagram.png)
Caption: Workflow for the Split travel assistant, coordinated through OpenClaw with fallback escalation to voice.

The most complex challenge appeared when data was missing or contradictory. Structured sources could not always be trusted, especially during holidays. To explore this gap, I experimented with a voice based agent using AgentPhone. The goal was to contact local businesses, ask for opening hours in Croatian, and translate the response into English.

In practice, this is not fully reliable. Conversations are unpredictable, background noise affects transcription, and responses vary widely depending on who answers the phone. Language nuances and accents introduce additional friction. The system can assist in making these calls and processing responses, but it still requires careful handling and fallback logic. It is better understood as an experimental escalation path rather than a fully autonomous solution.

Even with these limitations, voice provides access to information that is not consistently available through APIs or search.

Google's release of Gemma 4 made this setup feel more viable. The model family was positioned around unusually strong performance for its size, with a clear promise that capable agentic workflows could run closer to the edge on smaller hardware. The system runs locally using Gemma for reasoning on a MacBook M4 with 24GB RAM, which is sufficient for orchestrating tasks, handling multilingual input, and coordinating tool use with low latency. OpenClaw acts as the orchestration layer, managing agents, scheduling execution, coordinating tools, and handling fallback strategies. Outputs are delivered through WhatsApp and supported by a local TTS model.

What becomes clear is that useful AI systems depend on how well they coordinate actions over time. Orchestration, state, and recovery from incomplete information determine whether the system works in practice.

## Takeaways

- Travel is a strong real-world stress test because it combines stale data, changing context, and time-sensitive decisions.
- Reliable agentic systems depend more on orchestration, state, and recovery logic than on a single model acting alone.
- Voice can help close data gaps when APIs fail, but today it works better as an experimental fallback than a fully autonomous layer.
