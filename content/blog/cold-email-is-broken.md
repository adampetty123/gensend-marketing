---
title: "Cold email is broken. Here's the fix."
slug: cold-email-is-broken
date: 2026-06-06
excerpt: "Every cold email tool stops at 'send and pray.' That's the wrong layer. The real problem is everything that happens before the send and after the reply."
hero: "/blog/cold-email-is-broken.png"
author: "Adam Petty"
tags: ["cold-email", "deliverability", "agentic"]
reading_minutes: 4
---

Cold email is the most-used distribution channel in B2B. It is also the most-broken one.

Here is the standard playbook in 2026: you scrape a list out of Apollo, you upload it to Instantly or Smartlead, you stitch together a 4-step sequence in a no-code editor, you connect a mailbox, and you press send. Then you wait. Some replies land. Most do not. You blame the copy.

It is not the copy.

## The four real failure points

Every cold email tool sells you a sequencer. Sequencing is one job out of four. The other three are where every campaign actually breaks.

**1. Sourcing the right people.** Apollo gets you firmographic shapes — title, industry, headcount, geo. That is necessary. It is not sufficient. A "Series B SaaS in NYC" filter returns 200 rows. Twelve of them are the actual ICP. The rest are noise that costs you reputation when you email them.

**2. Finding the actual email.** Apollo's email coverage is decent. Apollo's email accuracy on rolled-up data is worse than people admit. A 5% bounce rate gets your sending domain throttled. A 10% rate kills it. The standard fix is "verify with NeverBounce before sending." That is right but it is not the whole answer — you also need a pattern guesser that catches the 30% of contacts where Apollo simply does not have the email.

**3. Writing copy that does not look like a script.** Every "AI cold email" tool today produces emails that sound like an AI wrote them. The reason is structural: they pass the lead row to a model and ask for an email. The model has no context on the company beyond the lead row. The output is generic. The fix is to ground the copy in three things the model normally cannot see: the workspace's own customer list (for credible name-drops), the recipient's recent public signals (their last post, their last hire, their last raise), and the founder's actual voice (not a generic template).

**4. Handling replies as well as sending them.** Send is half the loop. The other half is what happens when someone replies "interesting, can you send more info?" Most stacks dump the reply into a separate inbox and call it done. The right behavior is to triage by intent (positive, defer, objection, referral), draft the right follow-up, and queue it for a human review — same workflow whether it is one campaign or fifty.

## What changes when you fix all four

When the sourcing layer is right, you stop emailing the noise. Your bounce rate drops.

When the email-finding layer is right, you cover the 30% of contacts Apollo cannot. Your reach goes up.

When the copy layer is grounded in real customer name-drops and real recipient signals, reply rates climb from the 1–3% industry average to 8–12%. We have seen 14% on tight ICPs.

When the reply layer triages and drafts follow-ups automatically, your team stops being the bottleneck. One operator can run what used to be a four-person outbound team.

That is what Gensend is built for. Not a sequencer with AI grafted on. An agent that runs the whole loop.

## How we build it

We treat the four layers as four distinct services. Sourcing is a router that picks between cohort scrapers (YC, Techstars, etc), Apollo (firmographic), and agentic Firecrawl (novel niches). Email finding flips the standard cost order — pattern-guess + verify first, expensive web-search only on the misses. Copy is grounded in the workspace's customer allow-list with explicit anti-fabrication rules. Reply triage runs intent classification and drafts the next move.

Everything happens in one chat surface. You talk to the manager like you would talk to a human SDR — "find me 50 founders of YC P26 companies, write the email referencing our Bloom case study, send 5 a day starting Monday." It does the rest. You review, approve, ship.

The old cold email stack was eight tools and a maintenance burden. The new one is one agent.

That is what we are betting on.
