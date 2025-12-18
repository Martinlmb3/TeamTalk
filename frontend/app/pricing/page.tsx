import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "per team/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 15 team members",
        "Basic messaging",
        "Schedule management",
        "5GB file storage",
        "Email support",
        "Mobile app access",
      ],
      popular: false,
      cta: "Start Free Trial",
    },
    {
      name: "Professional",
      price: "$19",
      period: "per team/month",
      description: "Ideal for growing teams with advanced needs",
      features: [
        "Up to 50 team members",
        "Advanced messaging & channels",
        "Calendar integrations",
        "50GB file storage",
        "Priority support",
        "Custom team branding",
        "Analytics dashboard",
        "Video conferencing",
      ],
      popular: true,
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations with custom requirements",
      features: [
        "Unlimited team members",
        "Advanced security features",
        "Custom integrations",
        "Unlimited storage",
        "24/7 dedicated support",
        "Single sign-on (SSO)",
        "Advanced analytics",
        "API access",
        "Custom training",
      ],
      popular: false,
      cta: "Contact Sales",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Choose the perfect plan for your team. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/{plan.period}</span>}
                    {plan.price === "Custom" && <span className="text-muted-foreground"> - {plan.period}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-700 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
              <p className="text-slate-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
              <p className="text-slate-300">
                All plans come with a 14-day free trial. No credit card required to get started.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-300">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Do you offer discounts for annual billing?</h3>
              <p className="text-slate-300">Yes, save 20% when you choose annual billing on any plan.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
