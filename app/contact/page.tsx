import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

export default function ContactPage() {
  return (
    <div className="container-tight py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-primary mb-4">Get in Touch</p>
        <h1 className="font-display text-4xl font-medium mb-6">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have a question about a custom order, dietary needs, or wholesale? We&rsquo;d love to hear from you.
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <Input id="name" type="text" placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea
              id="message"
              rows={5}
              placeholder="How can we help?"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2"
            />
          </div>
          <Button type="submit">Send Message</Button>
        </form>
      </div>
    </div>
  );
}