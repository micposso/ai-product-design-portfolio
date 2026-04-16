# AI in education breaks at the governance layer
Category: AI in Education
Published At: April 16, 2026
Read Time: 8 min read
Prompt: Why do so many AI-in-education efforts stall, and what does Khanmigo reveal about FERPA, compliance, and faculty readiness?

## Excerpt

My take on why AI in education keeps getting framed as a model problem when it is really an institutional design problem, what Khanmigo reveals about rollout reality, and why faculty education matters as much as the product itself.

## Content

Everyone wants AI in education to arrive as a clean product category.

The dream is always the same: a personalized tutor for every student, a teaching assistant for every instructor, and a compliance story neat enough for a procurement office to sign off in one meeting.

That is not how this market behaves.

The real constraint is not whether a model can answer algebra questions, summarize readings, or generate a lesson plan. The constraint is whether a school, district, or university can govern the tool, contract it, explain it, monitor it, and train people to use it without creating new academic, legal, and operational risk.

That is why Khanmigo is such an important case.

I do not think Khanmigo "failed" in the lazy sense. Khan Academy is still here. The product still exists. Teachers still use it. But it did fail to become the simple institutional breakthrough that many people projected onto it when the first wave of AI hype hit education.

That distinction matters.

## Khanmigo was the market's cleanest test case

If any AI tutor was supposed to break through, it was this one.

Khan Academy had trust, distribution, mission alignment, brand equity with educators, and a subject area where tutoring actually makes sense. It was also unusually early in packaging generative AI around educational scaffolding instead of pure answer generation.

And yet the public record tells a more complicated story.

In Khan Academy's 2023-24 annual report, the organization said Khanmigo reached 221.2K total users and that 53 districts partnered with it, reaching about 68.2K students. That is real usage, but it is not category-defining institutional adoption. The same report also emphasizes the amount of implementation support required: professional learning, in-product feedback collection, focus groups, and ongoing iteration to help educators understand how to get value from the tool.

That is the key signal. Even the strongest nonprofit brand in digital learning could not just drop an AI assistant into schools and expect automatic integration.

Khan Academy's own educator guidance has stayed careful. As of January 23, 2026, Khanmigo usage guidance for educators still tells users to review outputs for hallucinations and avoid placing personally identifiable information into prompts or activities. Khan Academy's published safety materials also note that long sessions can drift or become repetitive, which is why the product limits how much interaction users can have in a day.

That is not a trivial footnote. It means the best-known AI tutor in the market is still fundamentally a supervised tool, not a delegated instructional actor.

"The product was never just competing on learning quality. It was competing with institutional friction."

What stalled Khanmigo was not just model quality. It was the mismatch between demo logic and school logic.

Schools do not buy possibility. They buy bounded risk.

## FERPA is not a deployment strategy

A lot of AI-in-education conversation still treats FERPA as if it were a magic label. If a vendor says "we are FERPA aware" or "we can operate under FERPA," people relax too quickly.

That is not enough.

FERPA is a narrow and aging legal framework. It matters, but it does not solve the operational reality of deploying generative AI into classrooms. Under the school official exception, a school can disclose education records to a contractor performing an institutional function, but only under specific conditions. The outside party has to be under the institution's direct control with respect to the use and maintenance of records, the data can only be used for the disclosed purpose, redisclosure is restricted, and the institution's annual FERPA notice has to define the criteria for who qualifies as a school official with legitimate educational interest.

In practice, that means legal theory has to become contract language.

If the vendor cannot explain data flow, retention, subprocessors, training boundaries, logging, deletion, access controls, incident response, and auditability, the institution is not actually ready to deploy the tool at scale. FERPA might permit disclosure in a narrow sense, but procurement, security, and general counsel will still slow-roll or block the deal.

The larger problem is that FERPA was not written for foundation models, prompt logs, retrieval layers, or cross-vendor AI stacks. It was signed into law in 1974. That does not make it irrelevant. It makes it incomplete.

So when education leaders ask whether an AI product is "FERPA compliant," they are usually asking a much bigger question than the statute itself answers.

They are asking whether the institution will retain meaningful control once student and instructor activity starts flowing through the system.

## Compliance is bigger than privacy

This is where a lot of founders lose the plot.

They think the hard part is convincing educators that AI can help. Usually the harder part is surviving institutional review.

In K-12, that means FERPA, state student privacy law, parental expectations, records governance, content moderation, and often procurement reviews that move slower than the technology cycle. In higher education, the stack expands even more. Security review, accessibility review, contractual data-use restrictions, research data sensitivity, faculty governance, and vendor risk assessment all get added to the mix.

That is why higher ed keeps leaning on shared review frameworks such as HECVAT. Not because campuses enjoy bureaucracy, but because universities need a repeatable way to ask whether a vendor can safely handle student, faculty, and research-adjacent data. If a product cannot survive that process, it is not institution-ready no matter how impressive the demo looks.

This is also why a lot of AI tools get adopted sideways. Individual instructors use them informally before the institution approves them centrally. That creates exactly the split that administrators fear: shadow AI use by people trying to solve real teaching problems faster than policy can catch up.

## Faculty education is the real adoption layer

The most underrated problem in AI in education is that institutions keep treating adoption as a software rollout when it is really a literacy and professional development problem.

Faculty do not just need prompts. They need judgment.

EDUCAUSE's 2024 AI literacy framework for higher education makes this explicit. Faculty need enough fluency to evaluate tool reliability, understand bias and misuse risk, redesign assignments, write course-specific AI policies, and make deliberate decisions about when AI should and should not appear in teaching. More recent EDUCAUSE work has kept circling the same issue from another angle: faculty skepticism is not just resistance to innovation. It is often a rational response to being asked to absorb risk without adequate clarity, training, or institutional support.

That is exactly why so many AI initiatives feel noisy but shallow.

A campus can license a tool in one quarter. It cannot build faculty confidence, revise pedagogy, align policy, and normalize responsible practice that quickly. If the faculty training layer is weak, the product gets reduced to novelty, avoidance, or inconsistent use. If the training layer is strong, even imperfect tools can become genuinely useful.

"In education, the implementation model is part of the product whether the vendor wants that to be true or not."

This is where the Khanmigo story becomes especially instructive. Khan Academy itself had to invest in helping educators understand when and how to use the tool well. That is the honest version of the market. Faculty and teachers are not blockers to AI adoption. They are the conditions under which adoption becomes real.

## What schools should actually optimize for

I think institutions should stop asking which AI tool is smartest and start asking which one can be governed.

That means a few things.

- Clear contractual limits on data use, retention, training, and redisclosure.
- A security and privacy review process that covers AI-specific behavior, not just generic SaaS checklists.
- Accessibility review, because a tool that excludes part of the classroom is not a teaching tool.
- Faculty and staff education that treats AI use as a pedagogical and operational judgment call, not just a feature set.
- Human-in-the-loop norms for high-stakes outputs such as grading, advising, intervention, and student support.
- A rollout plan that begins with bounded use cases instead of campus-wide magical thinking.

The institutions that do this well will look slower in the short term and much smarter over time.

The ones that do it badly will keep cycling between pilot programs, faculty distrust, privacy panic, and quietly abandoned tools.

## The real lesson

The first era of AI in education was sold as personalization.

The next era will be won by governance.

Khanmigo is useful precisely because it exposed the gap between those two things. It showed that even a mission-aligned, educator-friendly, well-branded AI product does not automatically become institutional infrastructure. It still has to earn trust across legal review, classroom practice, policy, faculty norms, and day-to-day instructional reality.

That is not a story about one product failing.

It is a story about a market discovering where the real work lives.

## Takeaways

- Khanmigo did not disappear, but it did show that even the strongest AI-in-education brand cannot skip implementation, training, and institutional trust-building.
- FERPA matters, but it does not answer the full deployment question for generative AI. Contract control, data governance, and vendor review matter just as much.
- Faculty education is not secondary rollout work. In practice, it is the layer that determines whether an AI tool becomes useful, risky, or ignored.
