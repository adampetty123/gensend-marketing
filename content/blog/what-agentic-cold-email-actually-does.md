---
title: "What 'agentic' cold email actually does."
slug: what-agentic-cold-email-actually-does
date: 2026-06-10
excerpt: "Every outbound tool put 'AI' in their hero this year. Most of them just wrapped GPT-4 around a template editor. Agentic means something specific. Here's what."
author: "Adam Petty"
tags: ["agentic", "ai", "cold-email"]
reading_minutes: 5
---

"Agentic" is on track to be 2026's "synergy." Every B2B tool slapped it on a landing page, hoping nobody asks what it means.

I'll tell you what it means in our context, because the word actually has teeth when you use it right.

## Not agentic

A model that takes a lead row and writes a one-shot email is not agentic. That is a function call. The model has one input, one output, no memory of what it just did, no ability to look anything up. It is a fancy template engine.

A model that takes a list of leads and writes emails in a loop is not agentic either. That is a function call with a `for`. Same shape, more output.

A model wired to "if reply detected, send follow-up" with a hardcoded template is not agentic. That is a workflow with one model call in it.

None of these are bad. They are useful. They are not what the word "agentic" describes.

## Actually agentic

An agent has three properties the function-call shapes don't have:

1. **It picks its own tools.** When the agent decides "I need to know if this prospect raised in the last 90 days," it doesn't ask the user. It calls a web search. When that returns "yes, raised $12M Series B led by Sequoia," it doesn't ask the user what to do with that. It writes a line for the email that references the raise. The user never sees the intermediate steps unless something interesting happens.

2. **It runs across multiple turns until the goal is reached.** Drafting a great cold email isn't one model call. It's: pull the workspace context, retrieve relevant past wins for this ICP, search for the recipient's last public signal, draft a first version, self-critique against the workspace voice guide, revise, check against deliverability rules (no spam triggers, no role accounts, length under 75 words), ship. Each step is its own decision the agent makes, not a step the user wrote.

3. **It pauses and asks the human only when the human's call actually matters.** Not "should I include their company name in the subject" (obviously yes). Not "should I follow up after 3 days" (yes, with a different angle). But "this prospect's website 404s and the LinkedIn says they shut down last month — should I skip them?" That, an agent asks. Everything else, it just does.

That is the shape. Tool use plus loop plus selective escalation.

## What it looks like in practice

When you brief Gensend with "find 50 boutique investment banks in NYC focused on tech M&A, target the managing partners, pitch our deal-room software," here is what happens in the background:

The decomposition agent picks origami as the right source backend for this brief (boutique IB is a directory-shaped problem, not a Apollo firmographic-shaped problem). It runs the search.

It returns 47 candidate firms. The classifier marks this as a company-shape campaign because "managing partner" at a boutique IB is owner-equivalent, not a specific functional title.

For each firm, a contact-finding agent runs sonnet 4.5 in a loop with web search, scrape, Apollo lookup, and email pattern guessing. It finds the managing partner. It finds their email. If it can't verify the email, it guesses + verifies the pattern.

For each contact with a verified email, a composer pulls the workspace's customer list (any prior IB clients we name-drop), the recipient's recent public signal (their last LinkedIn post, the last deal they advised, the last press release), and the founder's voice notes. It drafts an email. It self-critiques. It revises. It ships a draft to the table.

The user reads ~50 drafts. Approves or edits. Launches. Sends roll out at the right cadence. When replies come in, the reply triage agent classifies intent and queues the right follow-up draft for review.

Every step in there is an agent making a tool call to do work the operator used to do by hand. The user sees the output, not the intermediate work.

That is what "agentic" means. Not "we put AI in the loop." It means "the AI is the operator."

## Why it matters

The honest answer for why this matters is: the existing tools turn one human operator into a slightly faster human operator. They take 8 hours of weekly outbound work and turn it into 6.

That's not the win.

The win is turning 8 hours of weekly outbound work into 8 hours of weekly outbound *review*, where the actual writing, sourcing, finding, drafting, and triaging is all happening in the background while you're in a sales call. The operator's job moves from doing the work to checking the work. That is a 5-10x change in throughput per person, not a 1.2x change.

When we say "agentic cold email" that is the shape we mean. The operator becomes a reviewer. The work runs itself.

Anything less than that, the word doesn't apply.
