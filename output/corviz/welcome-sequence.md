# Corviz — Welcome Sequence
### 7 emails · 90 days · Paid pilot customers

---

## Sequence overview

**Who receives this:** Every garage that completes the £99 pilot payment.

**Trigger:** Stripe payment confirmation (checkout.session.completed webhook fires → add to Welcome Sequence).

**Purpose:** Deliver the concierge pilot experience. Each email is a touchpoint in the onboarding and review cycle. Emails 1 and 2 are templated. Emails 3, 4, 5, and 7 are personalised — Jack writes them based on each customer's actual data. Email 6 is conditional on pilot health.

**Note on tone:** These emails are the product. They are what "concierge" means in practice. Do not send template emails with blank fields. Each personalised email should take 20–45 minutes to write properly.

---

## Loading checklist

- [ ] From name: **Jack**
- [ ] Reply-to: jack@getcorviz.com
- [ ] Set preview text manually for every email
- [ ] Replace [JACK'S WHATSAPP NUMBER] in W1 before activating
- [ ] Add CSV walkthrough Loom links to W2 (one per system: MAM, GA4, Autowork Online)
- [ ] Add dashboard upload link to W2 and W3
- [ ] W3, W4, W5, W7 — send manually, personalised per customer. Do not bulk-send.
- [ ] W6 — conditional send only (see notes on that email)
- [ ] Test W1 and W2 with a real email address before going live

---

---

## W1 — You're in

**Send:** Immediately on payment confirmation (automated)
**Subject:** You're in — here's what happens next
**Preview text:** Three things to do today.

---

Hi [First name],

Payment confirmed. Your 90-day pilot starts now.

Three things to do today:

1. Fill in the intake form on the welcome page. Three questions, 2 minutes. Tells me which system you use so I can send the right CSV walkthrough.

2. Message me "Hi" on WhatsApp: [JACK'S WHATSAPP NUMBER]. That's how we'll talk for the next 90 days.

3. Watch the welcome video on the welcome page. Three minutes. Covers everything you need to know this week.

After you fill in the form, I'll send you a short video showing exactly how to export your customer list. Within 24 hours.

Your welcome pack goes in the post today or tomorrow. Padded envelope, first class.

Jack
Founder, Corviz
jack@getcorviz.com

P.S. If you haven't messaged me on WhatsApp yet, do that now. It's the number to use if anything is unclear at any point.

---

**Word count:** 149

**Notes:**
- Replace [JACK'S WHATSAPP NUMBER] with Jack's WhatsApp Business number in international format before this sequence goes live
- Welcome page URL: getcorviz.com/thankyou
- This email is fully automated — fires immediately on payment
- The welcome pack goes in the post same day or next day; have materials ready before the first customer signs up

---

---

## W2 — Your CSV walkthrough

**Send:** Day 1 — trigger when intake form is submitted, OR 24 hours after W1 if intake form has not been received
**Subject:** Your CSV walkthrough — watch this before you export
**Preview text:** 90 seconds. Specific to your system.

---

Hi [First name],

Here's the walkthrough for your system:

[LOOM LINK — personalised to the system they selected on the intake form]

It's 90 seconds. Shows you exactly which screen to go to and what columns you need.

Once you have the CSV, upload it here: [DASHBOARD UPLOAD LINK]

After you upload, I'll cross-check it against the DVLA and send you a personal Loom with what I found — usually within a few hours.

If your system isn't one of the standard three, message me on WhatsApp and I'll walk you through it.

Jack

P.S. The export takes 5 to 10 minutes once you know where to look. If you hit a wall, message me.

---

**Word count:** 119

**Notes:**
- Three separate Loom links needed before this sequence goes live — one for each system (MAM, GA4, Autowork Online). Slot in the correct one based on the intake form response.
- For HBS or any other system: send this email without a video link and handle via WhatsApp instead
- Dashboard upload link: add when dashboard is live
- If the intake form hasn't arrived after 24 hours, send a WhatsApp message before this email fires

---

---

## W3 — First batch ready to approve

**Send:** Day 3 — send manually after completing the DVLA cross-check for this customer
**Subject:** Your first batch is ready to approve
**Preview text:** Everything is set. Just need your sign-off.

---

Hi [First name],

I've reviewed your customer list and cross-checked it against the DVLA.

Here's what I found:

— [X] customers with MOTs due in the next 28 days
— [X] customers excluded — MOT already renewed elsewhere
— [X] customers removed — phone number issues
— [X] customers ready for the first batch

The first batch of [X] reminders is ready.

Log in to approve it here: [DASHBOARD LINK]

You'll see the exact message, who it's going to, and the send time. Edit the template, remove any names, or approve it as-is. Nothing fires until you approve it.

Any questions, message me on WhatsApp.

Jack

P.S. First replies usually come back the same day. Some will book. Some will say they've already done it elsewhere. Both are useful.

---

**Word count:** 147

**Personalise before sending:**
- Fill in the four data points (MOTs due, excluded, removed, ready) from the DVLA cross-check output
- Replace [DASHBOARD LINK] with the direct link to this customer's approval screen
- If the numbers look unusual — very high exclusion rate, lots of phone issues — add one sentence acknowledging it and explaining what it means. Don't send data that will confuse the customer without context.

**Do not send** as a bulk template. This email is always written and sent per customer after Jack has completed the DVLA review.

---

---

## W4 — Two weeks in

**Send:** Day 14 (personalised, sent manually)
**Subject:** Two weeks in — here's what I'm seeing
**Preview text:** Your numbers so far.

---

Hi [First name],

Two weeks in. Here's where things are.

Reminders sent: [X]
Replies received: [X]
Bookings logged: [X]
Estimated revenue: £[X]

[ONE PERSONALISED OBSERVATION — write one specific thing Jack has noticed about this customer's data. Examples below.]

Dashboard here if you want the full breakdown: [DASHBOARD LINK]

If anything looks off, or you've had replies you're not sure how to handle, message me on WhatsApp.

Jack

P.S. The biggest bookings often come 3 to 6 weeks after a reminder, not the same day. The number you're seeing now isn't the final number.

---

**Word count:** 105 (excluding personalised observation)

**Personalise before sending:**
- Pull actual dashboard numbers for this customer
- Write one specific observation. This is the proof of the concierge element — a generic line fails here. Examples of the right kind of observation:
  - "You've got a cluster of about 40 customers whose MOTs all fall in June. Worth a targeted batch in May — I'll flag it before it arrives."
  - "Your reply rate is higher than I'd expect. My guess is your customers recognise your number and trust it. That's a good signal."
  - "Three of your bookings so far came from customers who hadn't visited in over 18 months. That's exactly the pattern we're targeting."
  - "Delivery rate on the first batch was 94% — that's cleaner than most lists I see. Means your data is in good shape."

**If results are poor at day 14:** Address it directly rather than softening it. Say what you're seeing, why you think it happened, and what you're doing about it. The customer will notice if the numbers are low — acknowledging it builds trust, hiding it doesn't.

---

---

## W5 — Day 30 review

**Send:** Day 30 (personalised, sent manually)
**Subject:** Your day 30 review
**Preview text:** The first month. Here's what the numbers say.

---

Hi [First name],

Here's your day 30 review.

---

**What we sent**
[X] reminders across [X] batches. [Brief note on targeting — which customers, which MOT windows.]

**What came back**
[X] replies. [X] bookings confirmed and logged. [X] customers who said they'd already renewed elsewhere — that's the DVLA cross-check doing its job.

**Revenue attributed**
£[X] across [X] cars at an average of £[X] per booking.

**What I'd change for the next batch**
[One specific recommendation — e.g. timing, targeting a different MOT window, adjusting the message template, expanding to service reminders.]

**One thing I noticed**
[One observation about this customer's specific data — a pattern, an anomaly, or something worth watching.]

---

Day 30 is a data point, not a verdict. Customers who got a reminder in week one sometimes don't book until week six or eight. The full picture is clearer at day 60.

If anything in the review raises a question, reply here or message me on WhatsApp.

Jack

P.S. You don't need to do anything between now and day 60. The reminders keep running on the schedule we set.

---

**Word count:** ~170 (varies with personalised content)

**Personalise before sending:**
- Pull all four data sections from the dashboard
- Write a genuine recommendation for the next batch — not a generic "keep it up"
- Write a genuine observation — something specific to this customer's list
- Block 30–45 minutes per customer to write this properly

**If results are significantly below expectation:** Be honest. State what the numbers are, offer a hypothesis for why, and propose a specific change for the next 30 days. The guarantee means a customer who feels informed will stay — a customer who feels managed will ask for the refund.

---

---

## W6 — Annual option

**Send:** Day 75 (conditional — see notes)
**Subject:** An option before day 90
**Preview text:** Two months free, if you want it.

---

Hi [First name],

Three weeks until the end of the pilot.

If you're planning to continue and you'd rather pay annually than monthly, here's the option:

£390 for the year — two months free against the founding member rate of £39 a month.

Opt-in only. It never becomes automatic. If you'd rather stay monthly, you stay monthly at £39.

If you want the annual rate, reply to this email. I'll set it up manually.

If you're still deciding whether to continue, that's what day 90 is for. No pressure before then.

Jack

P.S. The annual option closes at day 90. After that it's monthly only.

---

**Word count:** 108

**Conditional send — read before sending:**
- Only send to customers where the pilot is clearly going well. Positive dashboard numbers, engaged on WhatsApp, no expressed doubts about continuing.
- Do not send to customers who have gone quiet, expressed doubt, or whose results are weak. Send a WhatsApp check-in first in those cases.
- Do not send to any customer you think is likely to take the refund at day 90.
- Annual rate: £390 (10 months × £39, 2 months free). Process via Stripe invoice, not automated checkout.

---

---

## W7 — 90-day review, decision Monday

**Send:** Day 88 — send on a Friday (personalised, sent manually)
**Subject:** Your 90-day review — decision due Monday
**Preview text:** Full review ready. Read it this weekend.

---

Hi [First name],

Ninety days.

Your full review is below.

---

**The full picture**

Reminders sent: [X total across [X] batches]
Total replies: [X]
Bookings logged: [X]
Revenue attributed: £[X] ([X] cars at avg £[X])

**What worked**
[Specific — what produced the most bookings, which customer segments responded, what the data showed.]

**What didn't**
[Honest — what underperformed, why, and whether it's fixable.]

**What the next 90 days would look like**
[One paragraph: which customer groups are next to target, what changes to the approach would be made, what the revenue projection looks like for months 4–6.]

---

Read that this weekend.

Monday, I need one of two answers:

1. Continue at £39 a month. Rate locked forever. I set up the subscription and send you a confirmation.

2. No.

Reply Monday.

Jack

P.S. If you need more time or something has come up, message me on WhatsApp. I'm not going anywhere.

---

**Word count:** ~180 (varies with personalised content)

**Why Friday:** The customer reads the review over the weekend without the distraction of a working week. Monday morning they reply with a clear head. Do not send on a Monday — the turnaround is too short and the customer's attention is elsewhere.

**Personalise before sending:**
- Block 45–60 minutes per customer to write this properly
- "What worked" and "what didn't" must be specific — a customer who has lived this pilot for 90 days will see through any vagueness immediately
- "What the next 90 days would look like" is the sales argument — make it concrete, not aspirational
- If the result has been strong: the case almost makes itself. Let the numbers do the work.
- If the result has been mixed: be honest about what underperformed, and specific about why the next 90 days would be different. The guarantee means a customer who trusts the reasoning will continue.

**On Monday:** If no reply by end of day, send a single WhatsApp message — not another email. Keep it short: "Just checking you got the review — let me know either way when you're ready."

**If they reply "No":** Do not process the refund automatically. Wait for them to email or WhatsApp asking for it. The guarantee is real — honour it without hesitation when they ask — but the ask must come from them. Do not chase the refund conversation if they go quiet after a "no."

---

---

## Quick reference

| # | Subject | Send | Type |
|---|---------|------|------|
| W1 | You're in — here's what happens next | Immediate | Automated |
| W2 | Your CSV walkthrough — watch this before you export | Day 1 | Automated (personalised link) |
| W3 | Your first batch is ready to approve | Day 3 | Manual — personalised |
| W4 | Two weeks in — here's what I'm seeing | Day 14 | Manual — personalised |
| W5 | Your day 30 review | Day 30 | Manual — personalised |
| W6 | An option before day 90 | Day 75 | Manual — conditional |
| W7 | Your 90-day review — decision due Monday | Day 88 (Friday) | Manual — personalised |

**Time budget per customer:** W1 and W2 are templated. W3 = 20 min. W4 = 20 min. W5 = 35 min. W6 = 5 min. W7 = 50 min. Total: ~2.5 hours per customer across 90 days.
