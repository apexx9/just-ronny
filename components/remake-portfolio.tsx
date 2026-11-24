"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useReducedMotion } from "framer-motion";
import PillNavigation from "@/components/ui/pill-navigation";
import ActivitySection from "@/components/activity-section";
import RoboticArm from "@/components/robotic-arm";
import { projects } from "@/lib/content";
import type { PostSummary } from "@/lib/post-summary";
import type { RecentTrack } from "@/lib/spotify";

const navItems = [
  { id: "work", label: "Work" },
  { id: "engineering", label: "Engineering" },
  { id: "about", label: "About" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

function ListeningStatus() {
  const [track, setTrack] = useState<RecentTrack | null>(null);
  const [mode, setMode] = useState<"playing" | "last_played">("last_played");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/spotify/recent", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unavailable")))
      .then((data: { track?: RecentTrack | null; mode?: "playing" | "last_played" }) => {
        setTrack(data.track ?? null);
        setMode(data.mode ?? "last_played");
      })
      .catch(() => setTrack(null))
      .finally(() => setLoaded(true));
    return () => controller.abort();
  }, []);

  if (!loaded || !track) return null;

  return (
    <a className="listen-line" href={track.href} target="_blank" rel="noopener noreferrer">
      {track.image ? <Image src={track.image} alt="" width={48} height={48} /> : <span className="listen-art-fallback">♫</span>}
      <span className="listen-copy">
        <span className="eyebrow">{mode === "playing" ? "NOW PLAYING" : "LAST PLAYED"}</span>
        <strong>{track.title}</strong>
        <span>{track.artist}</span>
      </span>
      <span className="listen-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Message could not be sent");
      setForm({ name: "", email: "", message: "", company: "" });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-grid">
        <label>Name<input name="name" autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      </div>
      <label>What are you working on?<textarea name="message" rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
      <label className="form-trap" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label>
      <div className="form-bottom">
        <button className="button button-light" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send message"} <span aria-hidden="true">↗</span></button>
        <p aria-live="polite">{status === "sent" ? "Thanks. Your message is on its way." : status === "error" ? "That didn't go through. Email me directly instead." : "Usually reply within a couple of days."}</p>
      </div>
    </form>
  );
}

export default function RemakePortfolio({ recentPosts }: { recentPosts: PostSummary[] }) {
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  const reveal = reducedMotion
    ? { initial: false as const, whileInView: undefined }
    : { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 } };

  return (
    <main className="site-shell">
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="Aaron Nartey, home">APX<span>®</span></Link>
        <div className="desktop-nav">
          <PillNavigation items={navItems} defaultValue="work" onChange={(id) => scrollToSection(id)} className="apx-pill-nav" />
        </div>
        <a className="header-contact" href="mailto:aaronnartey001@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a>
        <button className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((value) => !value)}>
          <span>{menuOpen ? "Close" : "Menu"}</span><span className="menu-mark" aria-hidden="true">{menuOpen ? "−" : "+"}</span>
        </button>
        {menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Main navigation">
          {navItems.map((item, index) => <button key={item.id} type="button" onClick={() => { setMenuOpen(false); scrollToSection(item.id); }}><span>0{index + 1}</span>{item.label}<span aria-hidden="true">↗</span></button>)}
        </nav>}
      </header>

      <section className="hero-section" id="top">
        <div className="hero-meta"><span>MECHATRONICS ENGINEER</span><span>ACCRA, GHANA · GMT</span></div>
        <div className="hero-main">
          <p className="hero-overline">AARON NARTEY <span>— INDEPENDENT ENGINEER</span></p>
          <h1>I make software<br />move <em>things.</em></h1>
          <div className="hero-bottom">
            <p className="hero-intro">I work across software, electronics and mechanical systems — building the intelligence and interfaces that connect the digital world to the physical one.</p>
            <div className="hero-actions"><button className="text-link" onClick={() => scrollToSection("work")}>Explore selected work <span>↓</span></button><a className="text-link" href="mailto:aaronnartey001@gmail.com">Start a conversation <span>↗</span></a></div>
          </div>
        </div>
        <div className="hero-index"><span>01 / 05</span><span>DESIGN · ENGINEERING · SOFTWARE</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section className="section work-section" id="work">
        <div className="section-heading"><div><span className="eyebrow">01 — SELECTED WORK</span><h2>Things made<br /><em>with intent.</em></h2></div><p>A selection of products and experiments across software and engineering. More detail is added as each project is documented.</p></div>
        <div className="project-list">
          {projects.map((project, index) => {
            const destination = project.liveUrl || (project.href !== "#" ? project.href : null);
            return <article className="project-row" key={project.id}>
              <div className="project-number">0{index + 1}</div>
              <div className="project-visual">
                <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(max-width: 760px) 100vw, 52vw" />
              </div>
              <div className="project-detail">
                <div className="project-kicker"><span>{project.discipline}</span><span>{project.period}</span></div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <p className="project-role">{project.role}</p>
                {project.techStack?.length ? <ul className="tech-list">{project.techStack.map((tech) => <li key={tech}>{tech}</li>)}</ul> : null}
                {destination ? <a className="text-link project-link" href={destination} target={destination.startsWith("http") ? "_blank" : undefined} rel={destination.startsWith("http") ? "noopener noreferrer" : undefined}>Visit project <span>↗</span></a> : <span className="project-status">CASE STUDY IN PROGRESS</span>}
              </div>
            </article>;
          })}
        </div>
      </section>

      <section className="engineering-section" id="engineering">
        <div className="engineering-copy">
          <span className="eyebrow">02 — ENGINEERING / LAB</span>
          <h2>From signal<br />to <em>motion.</em></h2>
          <p>Mechatronics is where my interests meet: mechanisms, sensors, actuators and control software working as one system. This interactive two-joint arm is a small inverse-kinematics study — move your pointer across the stage and watch the joints respond.</p>
          <div className="engineering-tags"><span>MECHANICS</span><span>CONTROL</span><span>EMBEDDED</span><span>ROBOTICS</span></div>
        </div>
        <div className="arm-stage"><div className="arm-stage-top"><span>SIMULATION / M-01</span><span>2 DOF · PLANAR</span></div><RoboticArm /><div className="arm-stage-bottom"><span>INTERACTIVE KINEMATICS STUDY</span><span>POINTER INPUT ENABLED</span></div></div>
      </section>

      <section className="section about-section" id="about">
        <div className="section-heading"><div><span className="eyebrow">03 — A LITTLE ABOUT ME</span><h2>Curious by nature.<br /><em>Precise by practice.</em></h2></div><p>Based in Accra, Ghana. Interested in the systems that make machines useful, responsive and intelligent.</p></div>
        <div className="about-grid"><p className="about-lead">I’m Aaron — a mechatronics engineer drawn to the space between hardware and software.</p><div className="about-detail"><p>I enjoy taking ideas from first principles to working systems: understanding the mechanics, choosing the electronics, writing the firmware and building the software around it. I’m especially interested in robotics, embedded systems, control and autonomous machines.</p><p>Outside engineering, I make time for music, long runs and the occasional deep dive into something I know very little about.</p><div className="about-links"><a href="https://github.com/apexx9" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.instagram.com/__aaro.nn" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="mailto:aaronnartey001@gmail.com">Email ↗</a></div></div></div>
        <div className="activity-wrap"><ActivitySection /></div>
      </section>

      <section className="section writing-section" id="writing">
        <div className="section-heading"><div><span className="eyebrow">04 — NOTES & IDEAS</span><h2>Thinking<br /><em>out loud.</em></h2></div><p>Notes on things I’m learning, building and thinking through.</p></div>
        {recentPosts.length ? <div className="writing-list">{recentPosts.slice(0, 4).map((post, index) => <Link href={`/blog/${post.slug}`} className="writing-row" key={post.slug}><span className="writing-index">0{index + 1}</span><span className="writing-title">{post.title}<small>{post.summary}</small></span><span className="writing-date">{post.date}</span><span className="writing-arrow" aria-hidden="true">↗</span></Link>)}</div> : <p className="empty-note">New writing is on the way.</p>}
        <Link className="text-link all-writing" href="/blog">All writing <span>↗</span></Link>
      </section>

      <section className="listening-section">
        <div><span className="eyebrow">CURRENT FREQUENCY</span><p>A little soundtrack to the work.</p></div><ListeningStatus />
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-heading"><span className="eyebrow">05 — HAVE SOMETHING IN MIND?</span><h2>Let’s make<br /><em>it real.</em></h2><p>Have a project, a question or an interesting problem? I’d like to hear about it.</p><a className="contact-email" href="mailto:aaronnartey001@gmail.com">aaronnartey001@gmail.com <span>↗</span></a></div>
        <ContactForm />
      </section>

      <footer className="site-footer"><Link href="/" className="wordmark">APX<span>®</span></Link><span>MECHATRONICS ENGINEER · ACCRA, GHANA</span><span>© 2026 AARON NARTEY</span><a href="#top">BACK TO TOP ↑</a></footer>
    </main>
  );
}
