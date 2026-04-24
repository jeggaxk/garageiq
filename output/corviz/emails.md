# Corviz Email Sequences

Three sequences. 15 emails total.

- **Sequence 1 — Nurture** (5 emails, 14 days): for guide optins who have not paid
- **Sequence 2 — Welcome** (7 emails, 90 days): for paid pilot customers
- **Sequence 3 — Post-Pilot** (3 emails, 30 days): for customers who took the refund

---

## Loading rules for all sequences

- Plain text format only — no HTML templates, no images, no banners
- From name: **Jack** (not "Corviz" or "The Corviz Team")
- Reply-to: jack@getcorviz.com — monitored, answered personally
- Preview text: set manually in your ESP for every email — do not leave blank
- Unsubscribe link: include in footer of every email — use plain language ("unsubscribe" not "manage preferences")
- Buyers: when a nurture subscriber completes payment, remove them from the nurture sequence immediately and add them to the welcome sequence
- Personalisation tokens: `[First name]` throughout — test with a real name before sending

---

---

# Sequence 1 — Nurture

For: guide optins who have not purchased the pilot
Trigger: guide optin form submission
Duration: 14 days, 5 emails
Exit condition: subscriber purchases pilot → move to Welcome sequence immediately

---

## N1 — Before I send you the guide

**Trigger:** Immediate on optin
**Subject:** Before I send you the guide
**Preview text:** One question first.

---

Hi [First name],

Thanks for signing up. The guide is ready to send.

Before I do — one question. Reply to this email and tell me: roughly how many customers are on your books right now?

I ask because the guide is written for garages with 300 to 1,500 customers on their books. If that's you, you'll get more out of it. If it's not, I'd rather tell you now than have you read something that doesn't apply.

Hit reply with a rough number and I'll send the guide straight back.

Jack
Founder, Corviz

P.S. If you'd rather just have the guide without the question, reply "send it" and I'll send it straight over.

---

**Notes:**
- Do NOT send the guide in this email. The reply-first approach builds a real conversation signal with inboxes and tells Jack immediately which subscribers are engaged.
- When a subscriber replies, send the guide link manually or trigger an automation that sends it within the hour.
- Guide link: [hosted PDF URL — add when guide is produced]

---

## N2 — What happened when the reminder fired

**Trigger:** Day 2 after optin
**Subject:** What happened when the reminder fired
**Preview text:** Three customers had already booked elsewhere.

---

Hi [First name],

The problem with most garage reminder tools isn't that the idea is wrong.

It's what happens when they fire blind.

A reminder goes out. Three customers reply saying they've already renewed their MOT elsewhere. Two numbers bounce. One reply is angry.

The owner turns it off. Never touches the reminder function again.

What the system didn't do: check whether the MOT had already been renewed. Check whether the number was still valid. Check whether the vehicle was still active at all.

Corviz cross-checks every reminder against the DVLA MOT database before anything fires. If a customer has already renewed their MOT elsewhere since their last visit, we catch it before the message reaches their phone.

The guide has a full breakdown of how often this pattern shows up — and what it costs when it doesn't get caught.

Jack

P.S. Has something like this happened at your garage? Reply and tell me — I want to understand how common it is.

---

**Notes:**
- No fabricated case study with a named garage or town — the above describes a pattern, not a specific customer
- Reply ask is genuine — Jack should respond to replies personally

---

## N3 — The maths most garage owners don't run

**Trigger:** Day 4 after optin
**Subject:** The maths most garage owners don't run
**Preview text:** 8 missing customers a month. Run the numbers.

---

Hi [First name],

Take your April last year. Pull up April this year's bookings.

How many names from last year are missing?

Most garage owners have never done this. When they do, the answer is usually 8 to 15 names missing — from one month.

Multiply by 12. Multiply by £85 per recovered car — that's a £55 MOT plus a £30 average advisory fix-on. You get somewhere between £8,000 and £15,000 that left quietly last year. Nobody sent a reminder.

The guide walks through exactly where that money goes. Not in round numbers — in five specific patterns that show up on almost every customer list.

If you want a rough estimate for your garage specifically, reply with how many customers you have on your books and which months are your busiest for MOTs. I'll send you a number.

Jack

P.S. The guide should be in your inbox from my first email. If it didn't arrive, reply here and I'll resend it.

---

**Notes:**
- The £85/car and 8–15 customers figures are from the locked strategy brief — do not change
- The offer to run a rough estimate is genuine; Jack should respond and do this manually for each reply

---

## N4 — Who Corviz isn't for

**Trigger:** Day 7 after optin
**Subject:** Who Corviz isn't for
**Preview text:** I'm going to be direct.

---

Hi [First name],

Most people on this list will never buy Corviz. I'm fine with that.

Corviz is built for one type of garage: 2 to 4 staff, owner-operated, doing MOTs and servicing, 300 to 1,500 customers on the books, 3 to 7 years under current ownership.

Too large, too small, different type of work, different ownership structure — it's probably not the right fit. I'd rather tell you that now.

If it is you, here's the pilot: £99 for 90 days. First reminders within 72 hours. I personally cross-check your customer list against the DVLA, you approve the first batch, and reminders start firing. At the end of 90 days, you decide whether it's paid for itself. If not, I refund the £99. No forms, no disputes. Your call.

There are 10 founding member spots. After those are gone, the monthly rate is £79 instead of £39.

getcorviz.com/signup

Jack

P.S. Not sure whether you fit? Reply and tell me about your garage. I'll tell you honestly.

---

**Notes:**
- This is the direct offer email — the only email in the nurture sequence with a signup link
- Founding member count: update "10 founding member spots" to reflect current availability as spots are taken

---

## N5 — Last email for now

**Trigger:** Day 14 after optin
**Subject:** Last email for now
**Preview text:** I won't keep chasing.

---

Hi [First name],

This is the last email in this sequence. I won't keep sending things you haven't asked for.

If the timing wasn't right — no problem. The offer is at getcorviz.com when it is.

If it wasn't for you at all, that's useful to know. Reply and tell me what didn't fit. It helps me understand which garages I should and shouldn't be writing to.

If something came up and you want to pick this back up, email me directly: jack@getcorviz.com. I answer every one.

Jack

P.S. Unsubscribe from this list at any time using the link below.

---

**Notes:**
- Genuinely the last email — do not add follow-ups after this
- Subscribers who reply after this email should be handled manually by Jack

---

---

# Sequence 2 — Welcome

For: paid pilot customers
Trigger: Stripe payment confirmation (checkout.session.completed webhook)
Duration: 90 days, 7 emails
Note: Emails W3, W4, W5, W7 contain personalised sections that Jack fills in manually based on each customer's dashboard data

---

## W1 — You're in

**Trigger:** Immediate on payment confirmation
**Subject:** You're in — here's what happens next
**Preview text:** Three things to do today.

---

Hi [First name],

Payment confirmed. Your 90-day pilot starts now.

Three things to do today:

1. Fill in the intake form on the thank-you page. Three questions, 2 minutes. Tells me which system you use so I can send the right CSV walkthrough.

2. Message me "Hi" on WhatsApp: [JACK'S WHATSAPP NUMBER]. That's how we'll talk for the next 90 days.

3. Watch the welcome video on the thank-you page. Three minutes. Covers everything you need to know this week.

After you fill in the form, I'll send you a short Loom video showing exactly how to export your customer list. Within 24 hours.

Your welcome pack goes in the post today or tomorrow. Padded envelope, first class. It'll arrive in the next few days.

Jack
Founder, Corviz
jack@getcorviz.com

P.S. If you haven't messaged me on WhatsApp yet, do it now. That's the number to use if anything is unclear at any point.

---

**Notes:**
- Replace [JACK'S WHATSAPP NUMBER] with Jack's WhatsApp Business number before loading
- Thank-you page URL: getcorviz.com/thankyou
- This email triggers regardless of whether the intake form has been filled in — the form is on the thank-you page which they've just landed on

---

## W2 — Your CSV walkthrough

**Trigger:** Day 1 — send either when intake form is submitted OR 24 hours after W1 if intake form not yet received
**Subject:** Your CSV walkthrough — watch this before you export
**Preview text:** 90 seconds. Specific to your system.

---

Hi [First name],

Here's the walkthrough for your system:

[INSERT ONE LINK based on intake form response — see notes]

It's 90 seconds. Shows you exactly which screen to go to and what columns you need.

Once you have the CSV, upload it here: [DASHBOARD UPLOAD LINK]

After you upload, I'll cross-check it against the DVLA and send you a personal Loom with what I found — usually within a few hours.

If your system isn't one of the standard three, message me on WhatsApp. I'll walk you through it.

Jack

P.S. The export usually takes 5 to 10 minutes once you know where to look. If you hit a wall, message me.

---

**Notes:**
- Three walkthrough videos need to be recorded before this sequence goes live (Tier 2 item 13 from readiness checklist)
- Personalise the link based on the system they selected in the intake form:
  - MAM: [MAM walkthrough Loom link]
  - GA4: [GA4 walkthrough Loom link]
  - Autowork Online: [Autowork walkthrough Loom link]
  - HBS or other: send manually via WhatsApp
- Dashboard upload link: add when dashboard is live

---

## W3 — First batch ready to approve

**Trigger:** Day 3 — OR send manually when Jack has completed the DVLA cross-check
**Subject:** Your first batch is ready to approve
**Preview text:** Everything is set. Just need your sign-off.

---

Hi [First name],

I've reviewed your customer list and cross-checked it against the DVLA.

Here's what I found:

— [X] customers with MOTs due in the next 28 days
— [X] customers excluded — MOT already renewed elsewhere
— [X] customers removed — phone number format issues
— [X] customers ready for the first batch

The first batch of [X] reminders is ready.

Log in to approve it here: [DASHBOARD LINK]

You'll see the exact messages, to whom, and the send time. Edit the template, remove names, or approve it as-is. Nothing fires until you hit approve.

Any questions, message me on WhatsApp.

Jack

P.S. The first replies usually come back the same day. Some will book. Some will say they've already done it. Both are useful data.

---

**Notes:**
- This email is personalised — Jack fills in the four data points before sending
- Do not send as a bulk automation; trigger manually per customer after completing the DVLA cross-check
- If day 3 arrives and no CSV has been uploaded, send a WhatsApp message first before this email

---

## W4 — Two weeks in

**Trigger:** Day 14
**Subject:** Two weeks in — here's what I'm seeing
**Preview text:** Your numbers so far.

---

Hi [First name],

Two weeks in. Quick read on where things are.

Reminders sent: [X]
Replies received: [X]
Bookings logged: [X]
Estimated revenue: £[X]

[One sentence of personalised observation — e.g. "You've got a cluster of customers whose MOTs all land in June. Worth a targeted batch before it arrives." Or: "Your reply rate is higher than I'd expect — your customers know your number and trust it."]

Dashboard here if you want the full breakdown: [DASHBOARD LINK]

If anything looks off, or you've had replies you're not sure how to handle, message me on WhatsApp.

Jack

P.S. The biggest bookings often come 3 to 6 weeks after a reminder, not the same day. The number you're seeing now isn't the final number.

---

**Notes:**
- Fill in actual dashboard data per customer before sending
- The one personalised observation is important — it's the proof of the concierge element
- Do not send as a bulk template with blank fields

---

## W5 — Day 30 review

**Trigger:** Day 30
**Subject:** Your day 30 review
**Preview text:** The first month. Here's what the numbers say.

---

Hi [First name],

Here's your day 30 review.

[PERSONALISED REVIEW — Jack writes per customer. Structure below as a guide:]

What we sent: [X reminders across [X] batches]
What came back: [X replies, [X] bookings confirmed]
Revenue attributed: £[X] ([X] cars at avg £[X])
What I'd change for the next batch: [specific recommendation]
One thing I noticed about your customer list: [observation]

Day 30 is a data point, not a verdict. Customers who got a reminder in week one sometimes don't book until week six. The full picture is clearer at day 60.

If anything in the review raises a question, reply here or message me on WhatsApp.

Jack

P.S. You don't need to do anything between now and day 60. The reminders keep running on the schedule we set.

---

**Notes:**
- Written per customer — block 30–45 minutes per customer to write a genuine review
- Do not send a template with blank fields
- If results are poor at day 30, address it directly in the review rather than softening it

---

## W6 — Annual option

**Trigger:** Day 75
**Subject:** An option before day 90
**Preview text:** Two months free, if you want it.

---

Hi [First name],

Three weeks until the end of the pilot.

If you're planning to continue and you'd rather pay annually than monthly, here's the option:

£390 for the year — that's two months free against the founding member rate of £39 a month.

Opt-in only. Never automatic. If you'd rather stay monthly, you stay monthly at £39.

If you want the annual rate, reply to this email. I'll set it up manually.

If you're still deciding whether to continue at all, that's what day 90 is for. No pressure before then.

Jack

P.S. The annual option closes at day 90. After that it's monthly only.

---

**Notes:**
- Only send to customers where the pilot is going well — if there are signs of disengagement, send a WhatsApp check-in before this email
- Do not send to customers who have already expressed doubt about continuing
- Annual option: £390 (10 months at £39, 2 months free) — process manually via Stripe invoice

---

## W7 — 90-day review, decision due Monday

**Trigger:** Day 88 (Friday of week 13)
**Subject:** Your 90-day review — decision due Monday
**Preview text:** Full review attached. Read it before Monday.

---

Hi [First name],

Ninety days.

Your full review is below [or: attached / linked here: LINK].

[FULL PERSONALISED REVIEW — Jack writes per customer. Covers: reminders sent total, total replies, bookings logged, revenue attributed, what worked, what didn't, what the next 90 days would look like.]

Read it this weekend.

Monday, I need one of two answers:

1. Continue at £39 a month. Rate locked forever. I set up the subscription and send you a confirmation.

2. Refund the £99. I process it same day. No forms, no disputes. Your call.

Either answer is the right answer. Reply Monday.

Jack

P.S. If you need more time or something has come up, message me on WhatsApp. I'm not going anywhere.

---

**Notes:**
- Send on a Friday so the customer reads the review over the weekend and responds Monday
- The full review is written per customer — block 45–60 minutes per customer
- Monday reply deadline is a soft deadline — honour it, don't chase before Monday
- On Monday: if no reply by end of day, send a single WhatsApp message (not another email)

---

---

# Sequence 3 — Post-Pilot

For: pilot customers who chose the refund
Trigger: refund processed (manual trigger by Jack)
Duration: 30 days, 3 emails
Goal: gather honest feedback, leave the door open

---

## P1 — Refund processed

**Trigger:** Immediate on refund confirmation
**Subject:** Refund processed — and three questions
**Preview text:** Done. No hard feelings.

---

Hi [First name],

Refund processed. £99 back in your account within 3 to 5 working days depending on your bank.

No hard feelings at all. The guarantee was real and I meant it.

One favour, if you're willing — three questions:

1. What didn't work? Was it the reminders themselves, the data quality, the timing, something about the setup?

2. Was there a moment during the pilot where you decided it wasn't going to work for you? When was it?

3. Is there anything I could have done differently — during onboarding, the first batch, the check-ins — that would have changed the outcome?

Reply to this email. You don't have to answer all three. Even one honest answer helps.

Jack

P.S. Your customer data has been deleted from the system. If you'd like a copy of your exported data, reply and I'll send it over.

---

**Notes:**
- Send on the same day the refund is processed — not automated, Jack sends manually
- These replies are the most valuable feedback in the business — treat them as priority responses
- Do not include any offer or re-engagement attempt in this email

---

## P2 — If one thing were different

**Trigger:** Day 100 (9 days after P1)
**Subject:** One question
**Preview text:** If one thing were different.

---

Hi [First name],

Short one.

If one thing about the pilot had been different — the setup, the timing, the product, anything at all — would you have continued?

Reply with whatever comes to mind. Doesn't have to be long.

Jack

P.S. No agenda. I'm not trying to sell you back in. Just want to understand what the single biggest obstacle was.

---

**Notes:**
- Single-question email — do not add anything else
- The P.S. is important to signal genuine intent, not a re-engagement attempt
- Only send if the customer did not reply to P1; if they replied to P1, this email is redundant — skip it

---

## P3 — Last one

**Trigger:** Day 120
**Subject:** Last one from me
**Preview text:** The door stays open.

---

Hi [First name],

Last email.

If circumstances change — different timing, different season, the problem gets bigger — the pilot is at getcorviz.com. I'll honour the same terms.

If you know another garage owner who'd be a better fit, I'd appreciate the introduction. Email me their name and I'll reach out.

Thanks for trying the pilot. The feedback you gave me is genuinely useful.

Jack

P.S. You're off this list now. I won't email again unless you reach out first.

---

**Notes:**
- Genuinely the last email — remove from all lists after this sends
- The referral ask is soft and optional — do not follow up on it if no reply
- "I'll honour the same terms" means the £99 pilot and founding member rate — only applicable while founding spots remain

---

---

# Quick reference — all 15 emails

| # | Code | Day | Subject |
|---|------|-----|---------|
| 1 | N1 | Immediate | Before I send you the guide |
| 2 | N2 | Day 2 | What happened when the reminder fired |
| 3 | N3 | Day 4 | The maths most garage owners don't run |
| 4 | N4 | Day 7 | Who Corviz isn't for |
| 5 | N5 | Day 14 | Last email for now |
| 6 | W1 | Immediate | You're in — here's what happens next |
| 7 | W2 | Day 1 | Your CSV walkthrough — watch this before you export |
| 8 | W3 | Day 3 | Your first batch is ready to approve |
| 9 | W4 | Day 14 | Two weeks in — here's what I'm seeing |
| 10 | W5 | Day 30 | Your day 30 review |
| 11 | W6 | Day 75 | An option before day 90 |
| 12 | W7 | Day 88 | Your 90-day review — decision due Monday |
| 13 | P1 | Immediate | Refund processed — and three questions |
| 14 | P2 | Day 100 | One question |
| 15 | P3 | Day 120 | Last one from me |

---

# Before you load these sequences

Checklist:
- [ ] Replace [JACK'S WHATSAPP NUMBER] in W1 with the actual number
- [ ] Add the guide PDF link to N1 (delivery automation)
- [ ] Add the three CSV walkthrough Loom links to W2 (one per system)
- [ ] Add the dashboard upload link to W2 and W3
- [ ] Add the dashboard link to W4
- [ ] Test all sequences with a real email address before going live
- [ ] Confirm buyer-exit logic: purchasing the pilot removes subscriber from nurture and adds to welcome
- [ ] Set preview text manually in your ESP for every email — do not leave blank
- [ ] Confirm reply-to address is jack@getcorviz.com on all sequences
