"use client"

import type React from "react"
import { useState } from "react"
import { ArrowUpRight, Mail, MapPin, MessageCircle } from "lucide-react"

const email = "aldizakiapratama@gmail.com"
const whatsappUrl = "https://wa.me/6285147107687?text=Hi%20Zaki%2C%20I%20found%20your%20portfolio."

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const subject = encodeURIComponent(formData.subject)
    const body = encodeURIComponent(
      `Hi Zaki,\n\n${formData.message}\n\nFrom: ${formData.name}\nEmail: ${formData.email}`,
    )
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="contact" className="section-shell bg-card py-20 md:py-28">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="section-kicker">04 / Contact</p>
            <h2 className="display-title mt-6 text-balance text-5xl sm:text-6xl lg:text-7xl">
              Have something worth <span className="text-primary">building?</span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Send the details directly from the form or use one of the links below. The form now opens your email
              client with the message pre-filled instead of pretending a message was sent.
            </p>

            <div className="mt-10 border-t border-border">
              <a href={`mailto:${email}`} className="flex items-center justify-between border-b border-border py-5 hover:text-primary">
                <span className="flex items-center gap-3"><Mail className="h-4 w-4" /> {email}</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between border-b border-border py-5 hover:text-primary">
                <span className="flex items-center gap-3"><MessageCircle className="h-4 w-4" /> WhatsApp</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <div className="flex items-center gap-3 border-b border-border py-5 text-muted-foreground">
                <MapPin className="h-4 w-4" /> Kudus, Central Java, Indonesia
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-border">
            <div className="grid sm:grid-cols-2">
              <label className="border-b border-border py-5 sm:border-r sm:pr-5">
                <span className="section-kicker">Name</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className="mt-3 w-full bg-transparent font-heading text-xl outline-none placeholder:text-muted-foreground/50"
                />
              </label>
              <label className="border-b border-border py-5 sm:pl-5">
                <span className="section-kicker">Email</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="mt-3 w-full bg-transparent font-heading text-xl outline-none placeholder:text-muted-foreground/50"
                />
              </label>
            </div>

            <label className="block border-b border-border py-5">
              <span className="section-kicker">Subject</span>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What are we building?"
                className="mt-3 w-full bg-transparent font-heading text-xl outline-none placeholder:text-muted-foreground/50"
              />
            </label>

            <label className="block border-b border-border py-5">
              <span className="section-kicker">Message</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="A little context helps..."
                className="mt-3 w-full resize-none bg-transparent text-base leading-7 outline-none placeholder:text-muted-foreground/50"
              />
            </label>

            <button type="submit" className="mt-6 inline-flex items-center gap-2 bg-foreground px-6 py-4 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5">
              Open email draft <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
