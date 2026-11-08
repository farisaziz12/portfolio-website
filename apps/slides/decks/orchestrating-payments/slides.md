---
theme: "faris"
title: "Orchestrating Payments for the Millions"
author: "Faris Aziz"
aspectRatio: "16/9"
canvasWidth: 1280
fonts:
  provider: "none"
themeConfig:
  farisMode: "light"
  farisBackground: "none"
transition: "fade"
drawings:
  enabled: false
layout: "cover"
faris:
  mode: "light"
  background: "arc"
sourceSlide: 1
---

# Orchestrating payments for the millions

Reactive payments at scale

::meta::
Faris Aziz · faziz-dev.com

::visual::
<FarisBadge />

<!--
Revolut keeps balances in multiple currencies and matches opposite customer flows internally, so a USD→EUR trade can offset an EUR→USD trade without touching the market. Only the leftover imbalance is pooled and sent to wholesale liquidity providers, which keeps spreads and fees very low.
-->

---
layout: "content"
sourceSlide: 2
---

::title::
# Who am I?

::default::
<div class="payments-split payments-bio">
<div>
<p class="payments-role">Staff Frontend Engineer @ Smallpdf</p>
<ul>
<li>Previous experience: Connected TV, Monetization/Growth, FinTech, Fitness Tech</li>
<li>Former CrossFit athlete &amp; trainer</li>
<li>Raycast Ambassador</li>
<li>Co-Founder of ZurichJS</li>
<li>Stripe Community Builder</li>
</ul>
</div>
<img src="/media/speaker-montage.png" alt="Faris speaking at events and spending time with the developer community">
</div>

---
layout: "section"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 3
---

# Story time

::visual::
<FarisIllustration name="faris-speaking" decorative />

<!--
Braintree Outage: We lost our integration with Braintree due to our API key being removed by mistake. This made it impossible for the majority of our users to create Subscriptions as its heavily reliant on Braintree.
-->

---
layout: "content"
sourceSlide: 4
---

::title::
# Braintree token errors

::default::
![TrackJS screenshot of BraintreeTokenFetchError volume](/media/braintree-errors.png)

<!--
High volume = hard to discern anomalies. This required metric segregation
-->

---
layout: "content"
sourceSlide: 5
---

::title::
# Subscription creation

::default::
![Datadog screenshot of the web.payment.subscription_created metric](/media/subscriptions-metric.png)

---
layout: "statement"
class: "payments-metric"
faris:
  mode: "dark"
sourceSlide: 6
---

# 9PM–10AM

Incident time

<!--
Lost sleep
-->

---
layout: "statement"
class: "payments-metric"
faris:
  mode: "dark"
sourceSlide: 7
---

# 12 hours

Downtime

---
layout: "statement"
class: "payments-metric"
faris:
  mode: "dark"
sourceSlide: 8
---

# ~5–10K USD

Lost in missed subscriptions

---
layout: "statement"
class: "payments-statement"
sourceSlide: 9
---

# We’re going to **change that**

---
layout: "section"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 10
---

# What are the struggles with payments?

::visual::
<FarisIllustration name="duck-curious" decorative />

---
layout: "statement"
class: "payments-statement"
sourceSlide: 11
---

# Currency & **FX fees**

<!--
You charge €100 in Germany, but your processor settles in USD with a 2% FX margin, and your bank adds another 1%. You just lost 3% on currency conversion alone.

Now imagine that pain, but for refunds
-->

---
layout: "statement"
class: "payments-statement"
sourceSlide: 12
---

# Optimizing payment methods **per country**

<!--
Athens: Saw busker accepting both PayPal and Credit card
-->

---
layout: "statement"
class: "payments-country"
sourceSlide: 13
---

# TWINT

::kicker::
Switzerland

<!--
Bangkok/Twint Example + SEPA
-->

---
layout: "statement"
class: "payments-country"
sourceSlide: 14
---

# Pix bank transfers

::kicker::
Brazil

<!--
Localized Pricing
-->

---
layout: "statement"
class: "payments-country"
sourceSlide: 15
---

# UPI

::kicker::
India

<!--
Unified Payments Interface
-->

---
layout: "statement"
class: "payments-country"
sourceSlide: 16
---

# iDEAL payments

::kicker::
Netherlands

<!--
Though deprecated and new one is Wero
-->

---
layout: "content"
sourceSlide: 17
---

::title::
# Last year, we introduced

::default::
<div class="payments-brand"><img src="/media/alipay.png" alt="Alipay"></div>

---
layout: "statement"
class: "payments-metric"
faris:
  mode: "dark"
sourceSlide: 18
---

# 3.5×

Increase in annual recurring revenue in China

---
layout: "section"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 19
---

# Regulation & compliance

---
layout: "statement"
class: "payments-statement"
sourceSlide: 20
---

# Sanctioned countries & restricted transactions

---
layout: "statement"
class: "payments-statement"
sourceSlide: 21
---

# No local business entity,<br>no payments

<!--
This is where merchant of record is handy: A merchant of record is the legal entity responsible for processing customer payments, handling taxes, refunds, and chargebacks on behalf of a business.
-->

---
layout: "statement"
class: "payments-statement"
sourceSlide: 22
---

# Country-dependent compliance

<!--
US has 11,000 tax jurisdictions
-->

---
layout: "statement"
class: "payments-metric"
sourceSlide: 23
---

# 11,000+

Tax jurisdictions in the US

<!--
Nexus = sufficient connection between a business and a state 
Physical Nexus (office) OR Economic Nexus (transactions, volumes)

You need to collect Zip code, street, etc. Adding fields reduce conversion.11% conversion drop just for adding first and last name
-->

---
layout: "statement"
class: "payments-statement"
sourceSlide: 24
---

# Chargebacks & disputes

<!--
Providers can pull the plug
-->

---
layout: "section"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 25
---

# Reliability & uptime

---
layout: "content"
sourceSlide: 26
---

::title::
# 99.9% availability

::default::
![Original uptime calculator screenshot showing downtime allowances at 99.9% SLA](/media/uptime-calculator.png)

<!--
99.999% = Yearly: 5m 16s
-->

---
layout: "content"
sourceSlide: 27
---

::title::
# Stripe incidents

::default::
![Original dated Stripe status screenshots: PayPal, Bancontact and API incidents](/media/stripe-incidents.png)

<!--
Elevated PayPal Errors: 1.5 hours

Elevated Bancontact errors: 45min

Elevated API errors: 2 hours
-->

---
layout: "content"
sourceSlide: 28
---

::title::
# PayPal incidents

::default::
![Original dated PayPal status history screenshot](/media/paypal-incidents.png)

<!--
8 hours
-->

---
layout: "content"
sourceSlide: 29
---

::title::
# Payment orchestration

::default::
<div class="payments-split payments-aircraft"><p>Think of it like air traffic control for payments, directing transactions to the best route for cost, speed and reliability.</p><img src="/media/air-traffic-control.png" alt="Air traffic controller coordinating routes"></div>

---
layout: "section"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 30
---

# Payment orchestration

::visual::
<FarisIllustration name="faris-thinking" decorative />

<!--
What is this payment orchestration thing?
-->

---
layout: "statement"
class: "payments-statement"
sourceSlide: 31
---

# One system to manage **multiple payment providers**

---
layout: "statement"
class: "payments-statement"
sourceSlide: 32
---

# Route transactions based on **cost, success rate, or region**

<!--
Stripe automatically optimized the order of payment methods but that doesn’t mean the default is optimization is right for you! A/B testing is important!
-->

---
layout: "statement"
class: "payments-statement"
sourceSlide: 33
---

# Reduce reliance on a **single provider** to avoid downtime

---
layout: "statement"
class: "payments-statement"
sourceSlide: 34
---

# Optimize payment methods per country for **higher success rates**

---
layout: "content"
class: "payments-table"
sourceSlide: 35
---

::title::
# Currency & FX fees

::default::
| Availability | Country | Stripe fees | Revolut Pay fees | Comparison |
| --- | --- | --- | --- | --- |
| Overlapping | United Kingdom | 1.5% + £0.2 | 1.0% + £0.2 | Revolut |
| Overlapping | France | 2.5% + €0.2 | 1.0% + €0.2 | Revolut |
| Only Revolut | Cyprus | N/A | 1.0% + €0.2 | Revolut |
| Only Revolut | Estonia | N/A | 1.0% + €0.2 | Revolut |
| Only Stripe | United States | 2.9% + $0.3 | N/A | Stripe |
| Only Stripe | Canada | 2.9% + CA$ 0.3 | N/A | Stripe |

---
layout: "section"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 36
---

# Frontend architecture

---
layout: "content"
sourceSlide: 37
---

::title::
# Frontend architecture

::default::
<PaymentFlow stage="initialize" />

<!--
It defines a list of rules to decide which payment gateway should be used. The rules are checked in order, from most important to least important:
	1.	Pick the gateway that matches the one already in use.
	2.	If not, prefer gateways limited to a specific experiment.
	3.	If not, prefer gateways limited to certain countries (strict list).
	4.	If not, prefer gateways allowed in some countries (looser list).
-->

---
layout: "content"
sourceSlide: 38
---

::title::
# Frontend architecture

::default::
<PaymentFlow stage="prioritize" />

---
layout: "content"
sourceSlide: 39
---

::title::
# Frontend architecture

::default::
<div class="payment-providers">
<div class="payment-provider"><img src="/media/stripe.png" alt="Stripe"><h2>Alipay</h2><p>Payment method</p><strong>CNY</strong><p>Currency</p></div>
<div class="payment-provider"><img src="/media/revolut.png" alt="Revolut"><h2>Card</h2><p>Payment method</p><strong>USD</strong><p>Currency</p></div>
<div class="payment-provider"><img src="/media/adyen.png" alt="Adyen"><h2>Card</h2><p>Payment method</p><strong>CNY</strong><p>Currency</p></div>
</div>

<!--
Alipay example
-->

---
layout: "content"
class: "payments-table"
sourceSlide: 40
---

::title::
# Frontend architecture

::default::
| Priority | Provider | Payment method matches | Currency matches |
| --- | --- | --- | --- |
| 1st | Stripe | Yes | Yes |
| 2nd | Adyen | No | Yes |
| 3rd | Revolut | No | No |

---
layout: "wide-code"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 41
---

::title::
# Provider nesting

::default::
```tsx
export default function App() {
  return (
    <StripeProvider>
      <AdyenProvider>
        <RevolutProvider>
          <Checkout />
        </RevolutProvider>
      </AdyenProvider>
    </StripeProvider>
  );
}
```

---
layout: "wide-code"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 42
---

::title::
# One orchestration provider

::default::
```tsx
// const state = { country: "CN", currency: "CNY" }

export default function App() {
  return (
    <PaymentOrchestratorProvider>
      <Checkout />
    </PaymentOrchestratorProvider>
  );
}
```

---
layout: "wide-code"
class: "payments-code-dense"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 43
---

::title::
# Each provider has its own API

::default::
```tsx
export function Checkout() {
  const stripe = useStripe();
  const adyen = useAdyen();
  const revolut = useRevolut();
  const handlePayment = () => {
    if (stripe.isActive) {
      stripe.processPayment({ amount: 1000, currency: "USD" });
    } else if (adyen.isActive) {
      adyen.submitPayment({ value: 1000, currencyCode: "USD" });
    } else if (revolut.isActive) {
      revolut.pay({ totalAmount: 1000, currencyType: "USD" });
    }
  };
  return <button onClick={handlePayment}>Pay Now</button>;
}
```

---
layout: "wide-code"
class: "payments-code-dense"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 44
---

::title::
# Introduce the shared payment API

::default::
```tsx {5,14}
export function Checkout() {
  const stripe = useStripe();
  const adyen = useAdyen();
  const revolut = useRevolut();
  const payment = usePaymentOrchestrator();
  const handlePayment = () => {
    if (stripe.isActive) {
      stripe.processPayment({ amount: 1000, currency: "USD" });
    } else if (adyen.isActive) {
      adyen.submitPayment({ value: 1000, currencyCode: "USD" });
    } else if (revolut.isActive) {
      revolut.pay({ totalAmount: 1000, currencyType: "USD" });
    }
    payment.process({ amount: 1000, currency: "USD" });
  };
  return <button onClick={handlePayment}>Pay Now</button>;
}
```

---
layout: "wide-code"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 45
---

::title::
# The checkout uses one API

::default::
```tsx
export function Checkout() {
  const payment = usePaymentOrchestrator();

  const handlePayment = () => {
    payment.process({ amount: 1000, currency: "USD" });
  };

  return <button onClick={handlePayment}>Pay Now</button>;
}
```

---
layout: "wide-code"
class: "payments-code-dense"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 46
---

::title::
# PaymentOrchestratorConfig.ts

::default::
<div class="payments-code-columns">

```ts
const gateways = {
  [Stripe]: {
    enabledCriteria: {
      countries: { onlyIn: ['CN'] },
      experiment: {
        onlyIn: [TestKey.StripeGateway],
      },
      currencies: null,
    },
    paymentMethods: [
```

```ts
      {
        method: PaymentMethod.Alipay,
        isEnabled: (state) => {
          const country = getCountry(state);
          return country === 'CN';
        },
      },
    ],
    PaymentGatewayContextProvider:
      StripeProvider,
  },
};
```

</div>

---
layout: "wide-code"
class: "payments-code-dense"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 47
---

::title::
# Add PayPal for the US

::default::
<div class="payments-code-columns">

```ts
const gateways = {
  [Stripe]: {
    enabledCriteria: {
      countries: { onlyIn: ['CN', 'US'] },
      experiment: {
        onlyIn: [TestKey.StripeGateway],
      },
      currencies: null,
    },
    paymentMethods: [
      {
        method: PaymentMethod.Alipay,
        isEnabled: (state) => {
          const country = getCountry(state);
          return country === 'CN';
        },
      },
```

```ts {1-7}
      {
        method: PaymentMethod.Paypal,
        isEnabled: (state) => {
          const country = getCountry(state);
          return country === 'US';
        },
      },
    ],
    PaymentGatewayContextProvider:
      StripeProvider,
  },
};
```

</div>

---
layout: "statement"
class: "payments-metric"
sourceSlide: 48
---

# 7

Lines of code to add a payment method

---
layout: "statement"
class: "payments-statement"
faris:
  mode: "dark"
sourceSlide: 49
---

# Infrastructure as code

---
layout: "statement"
class: "payments-statement"
faris:
  mode: "dark"
sourceSlide: 50
---

# ~~Infrastructure~~ as code

---
layout: "statement"
class: "payments-statement"
faris:
  mode: "dark"
sourceSlide: 51
---

# **Payments** as code

---
layout: "section"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 52
---

# Benefits

::visual::
<FarisIllustration name="duck-celebrating" decorative />

---
layout: "statement"
class: "payments-statement"
sourceSlide: 53
---

# Version control your payments config

---
layout: "statement"
class: "payments-statement"
sourceSlide: 54
---

# Unit test your payments config

---
layout: "content"
sourceSlide: 55
---

::title::
# Case study: $10M ARR SaaS

::default::
<div class="payments-case">
<div><h2>~$1,140</h2><div><h3>Estimated hourly revenue</h3><p>Running 24/7/365</p></div></div>
<div><h2>99.9%</h2><div><h3>Availability</h3><p>Up to 8h 41m 38s downtime, potential loss: ~$9,925/year</p></div></div>
<div><h2>5–15%</h2><div><h3>Uplift · payment methods</h3><p>Prioritizing Pix payments in Brazil vs credit card increases conversion by 5–15%, avoids high credit card fees (~2–4%) and reduces chargeback risks.</p></div></div>
</div>

---
layout: "section"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 56
---

# Demo

---
layout: "content"
faris:
  mode: "dark"
sourceSlide: 57
---

::title::
# Checkout demo

::default::
<DemoPlaceholder poster="/media/checkout-demo-poster.png" title="Payment orchestration walkthrough" />

---
layout: "statement"
class: "payments-metric"
sourceSlide: 58
---

# ~70%

Drop in component bundle size

---
layout: "section"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 59
---

# Edge cases

::visual::
<FarisIllustration name="duck-curious" decorative />

---
layout: "statement"
class: "payments-statement"
sourceSlide: 60
---

# Payment method reordering

<!--
Your A/B tests can help you determine what is the best order. You can configure at a country level

30% users go to google search first result. 
-->

---
layout: "statement"
class: "payments-statement"
faris:
  mode: "dark"
sourceSlide: 61
---

# SEPA payments

---
layout: "statement"
class: "payments-statement"
sourceSlide: 62
---

# Most payment methods have **&lt;24h settlement periods**

---
layout: "statement"
class: "payments-metric"
sourceSlide: 63
---

# 24h

Grace period

---
layout: "statement"
class: "payments-statement"
sourceSlide: 64
---

# SEPA payments can take up to **5–6 days** to settle

---
layout: "statement"
class: "payments-metric"
sourceSlide: 65
---

# 6 days

Grace period

---
layout: "statement"
class: "payments-statement"
faris:
  mode: "dark"
sourceSlide: 66
---

# Tax inclusivity / exclusivity

---
layout: "statement"
class: "payments-statement"
sourceSlide: 67
---

# EU = **tax inclusive**

---
layout: "statement"
class: "payments-statement"
sourceSlide: 68
---

# US = **tax exclusive**

---
layout: "statement"
class: "payments-statement"
sourceSlide: 69
---

# A/B test inclusivity / exclusivity

---
layout: "statement"
class: "payments-statement"
faris:
  mode: "dark"
sourceSlide: 70
---

# UPI in India

---
layout: "statement"
class: "payments-metric"
sourceSlide: 71
---

# 15K INR

Threshold on mandate behavior

<!--
So if you have seat based pricing, can increase friction
-->

---
layout: "statement"
class: "payments-statement"
sourceSlide: 72
---

# Pause/resume functionality required

---
layout: "section"
faris:
  mode: "dark"
  background: "none"
sourceSlide: 73
---

# What about when things go wrong?

::visual::
<FarisIllustration name="faris-thinking" decorative />

---
layout: "content"
sourceSlide: 74
---

::title::
# Anomaly detection

::default::
<p>Seasonality &amp; anomaly-based alerts for</p>
<ul class="payments-list"><li>Gateway</li><li>Currency</li><li>Country</li></ul>

---
layout: "statement"
class: "payments-metric"
faris:
  mode: "dark"
sourceSlide: 75
---

# 15 minutes

Away from detecting any metric deviation

---
layout: "content"
sourceSlide: 76
---

::title::
# We got an alert!

::default::
<p>Failing payments for</p>
<ul class="payments-list"><li>Braintree</li><li>Switzerland</li></ul>

<!--
Let’s reroute it to Stripe!
-->

---
layout: "content"
faris:
  mode: "dark"
sourceSlide: 77
---

::title::
# Failover demo

::default::
<DemoPlaceholder poster="/media/failover-demo-poster.png" title="Rerouting payments to Stripe" />

---
layout: "statement"
class: "payments-metric"
sourceSlide: 78
---

# 30 seconds



---
layout: "statement"
class: "payments-metric"
sourceSlide: 79
---

# 10 minutes

To operational

::annotation::
Your only limiting factor is the speed of your build pipeline

---
layout: "statement"
class: "payments-statement"
sourceSlide: 80
---

# What if we could **safely simulate this?**

---
layout: "statement"
class: "payments-statement"
faris:
  mode: "dark"
sourceSlide: 81
---

# Chaos engineering

<!--
Chaos engineering is the practice of deliberately injecting failures into a system to test its resilience and uncover weaknesses before they cause real outages.
-->

---
layout: "statement"
class: "payments-statement"
faris:
  mode: "dark"
sourceSlide: 82
---

# Game days

<!--
Game days are scheduled, controlled exercises where teams simulate incidents or failures in production-like environments to practice response and validate system reliability.
-->

---
layout: "content"
sourceSlide: 83
---

::title::
# Payment gateway chaos engineering

::default::
![Original screenshot of the payment gateway chaos engineering sandbox and orchestration editor](/media/chaos-demo.png)

---
layout: "content"
sourceSlide: 84
---

::title::
# 

::default::
<div class="payments-closing">
<div><h1>So long &amp; thanks<br>for all the fish</h1>
<div class="payments-connect"><img src="/media/contact-qr.png" alt="Original contact QR code"><div><p>Connect with me</p><p>faziz-dev.com</p></div><FarisBadge /></div>
</div>
<img src="/media/speaker-montage.png" alt="Faris and the developer community">
</div>
