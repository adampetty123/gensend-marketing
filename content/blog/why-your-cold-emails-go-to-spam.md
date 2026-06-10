---
title: "Your cold emails are going to spam. Here's exactly why."
slug: why-your-cold-emails-go-to-spam
date: 2026-06-10
excerpt: "Most 'deliverability tips' threads are noise. The real reasons your mail lands in spam are technical, boring, and fixable in an afternoon."
hero: "/blog/why-your-cold-emails-go-to-spam.png"
author: "Adam Petty"
tags: ["deliverability", "cold-email", "spf-dkim-dmarc"]
reading_minutes: 6
---

If your cold campaign reply rate dropped this quarter, the copy is probably not the problem. The mailbox is.

I have looked at hundreds of cold campaigns in the last year. The pattern is almost always the same: a domain that looks fine to the human eye, a deliverability stack that the founder thought was set up, and an inbox placement rate that quietly slid from 90% to 40% over six weeks. Nobody noticed because every "sent" looked like every other sent in the dashboard. The replies just stopped.

Here is the unglamorous list of what is actually wrong, in the order it matters.

## 1. You're sending from your real domain

If your "from" address is `adam@yourcompany.com` and that is also the domain your real customers reach you at, every cold send is putting your primary domain reputation on the line. Two bad days of bounces and you have to send a "hey can you re-add me to your contacts" email to your actual customers.

The fix is structural. Buy a lookalike domain — `getyourcompany.com`, `tryyourcompany.com`, `yourcompany.io` — and send cold from that. Point its web URL back to your real site. If reputation tanks, you swap the domain and your real one stays clean.

This single move is the difference between a sustainable outbound operation and a one-quarter blip.

## 2. SPF, DKIM, and DMARC aren't actually configured

Every guide says "set up SPF/DKIM/DMARC." Half the founders I talk to think they did. They didn't.

The check takes 30 seconds. Open a terminal:

```
dig TXT yourdomain.com
dig TXT _dmarc.yourdomain.com
dig TXT google._domainkey.yourdomain.com
```

If you don't see records for all three, your mail is being filtered before it gets to the recipient. Most "DMARC reports" services people pay for are just selling them a dashboard for a number that hasn't moved because the records were never there.

For Google Workspace senders, the right shape is:
- SPF: `v=spf1 include:_spf.google.com ~all`
- DMARC: `v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com` (start at `p=none`, move to `p=quarantine` later)
- DKIM: 2048-bit key from Workspace Admin → Authentication → DKIM, planted at `google._domainkey`

That's the whole list. There is no fourth record someone is selling you.

## 3. Your mailbox isn't warmed

A brand new mailbox is suspicious to every spam filter on the planet. Send 200 cold emails on day one from a fresh mailbox and you are not going to get into inboxes — you are going to get flagged, and the flag follows the domain for weeks.

The warmup pattern that works: 10-15 sends a day for the first 7 days, ramp to 30 by day 14, 50 by day 21. Send conversational, replied-to mail during warmup — not cold mail. Most warmup services do this badly because they send to dead inboxes that never reply. The thing that actually moves reputation is two-way conversation.

If you want the long version: warmup is a 21-day commit, not a button. Tools that promise "instant warmup" are setting you up for the same problem you started with.

## 4. Your list is full of role accounts

Every time you send to `info@`, `sales@`, `support@`, `team@`, or `hello@`, the receiving server treats it as a low-trust signal. Send to enough of them and your sending reputation gets dinged independent of bounce rate.

Pull role accounts out before you send. The standard list: info, sales, support, contact, hello, team, admin, marketing, hr, legal, press, billing, accounts. Anything that ends in `@yourcompany.com` and is not a real human's name.

You will lose maybe 5% of your "addressable" list. You will gain 30% inbox placement.

## 5. Your bounce rate is over 3%

The threshold isn't 10%. It's 3%. Above that, Gmail starts throttling your domain in their backend without telling you. You will keep "sending" but more and more of those sends never reach the inbox.

The fix: verify every email before you send. Even Apollo's own emails — Apollo's accuracy on rolled-up data is much worse than people admit. Tools that catch invalid addresses pay for themselves on the first campaign.

For contacts where you don't have a verified email, guess the pattern (`first.last@`, `first@`, `flast@`) and verify each guess. If none verify, drop the row. A bad guess is worse than no guess.

## 6. Your reply rate is too low

This one feels backwards but it's the most important.

Spam filters watch reply rates as a positive signal. A domain that sends 100 emails a day and gets 2 replies looks like marketing automation. A domain that sends 30 a day and gets 4 replies looks like a real person. Counterintuitively, sending less is often what fixes deliverability — because the small batch you do send actually gets read and replied to, which trains the filter to trust you.

If your reply rate is under 1%, the answer is not "send more." The answer is "send to a tighter list with better copy" until that number is over 4%. Then it's safe to scale.

## The whole list, one more time

If your cold emails are going to spam, in priority order:

1. Stop sending from your primary domain. Buy a lookalike.
2. Check that SPF, DKIM, DMARC are really there. Half the time they aren't.
3. Warm the mailbox for 21 days before you send any cold mail at all.
4. Strip role accounts from every list.
5. Verify every email before you send. Drop rows you can't verify.
6. Get your reply rate above 4% on a small batch before scaling.

None of this is glamorous. None of it is a growth hack. All six are the actual reason a campaign that "looks fine" doesn't get replies. Fix them once and the next campaign you run will land in the inbox.

That is the whole answer.
