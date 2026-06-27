import connectDB from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import Skill from "@/models/Skill";
import Experience from "@/models/Experience";
import Project from "@/models/Project";
import TypedLine from "@/components/TypedLine";
import Link from "next/link";
import { FaFileDownload } from "react-icons/fa";
import ThemeToggle from "@/components/ThemeToggle";


export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connectDB();

  let content = await SiteContent.findOne();
  if (!content) content = await SiteContent.create({});

  const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
  const experience = await Experience.find().sort({ order: 1, createdAt: -1 });
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });


  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <nav>
        <div className="wrap">
          <Link href="/"><div className="brand">Ehtisham Ali</div> </Link>
          <div className="nav-links">
            <a href="#stack"><span className="num">01</span>Stack</a>
            <a href="#experience"><span className="num">02</span>Experience</a>
            <a href="#projects"><span className="num">03</span>Projects</a>
            <a href="#contact"><span className="num">04</span>Contact</a>
            <ThemeToggle />
          </div>
          {content.cvUrl ? (
            <a href="/resume.pdf" download="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost mono" style={{ padding: "9px 16px", fontSize: 18 }}>
              Resume <FaFileDownload size={18} />
            </a>
          ) : <span />}
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            {content.availableForWork && (
              <div className="eyebrow">AVAILABLE FOR FREELANCE &amp; FULL-TIME ROLES</div>
            )}
            <h1 className="display">{content.heroHeadline}</h1>
            <p className="hero-sub">{content.heroSubtext}</p>
            <TypedLine role={content.role} />
            <div className="cta-row">
              <a href="#contact" className="btn btn-primary">Get in touch</a>
              {content.cvUrl && (
                <a href="/resume.pdf" download="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Resume <FaFileDownload size={18} /></a>
              )}
            </div>
          </div>

          <div className="term-card">
            <div className="term-body">
              <div className="term-img">
                {content.photoUrl && <img src={content.photoUrl} alt={content.name} />}
              </div>

            </div>
          </div>
        </div>
      </header>

      <section id="stack">
        <div className="wrap">
          <div className="sec-label"><span className="kw">const</span> skills <span className="kw">=</span> <span className="str">[ ... ]</span></div>
          <h2 className="sec-title">Technologies I work with</h2>
          <div className="stack-grid">
            {skills.map((s) => (
              <div className="stack-card" key={s._id}>
                <div className="name">{s.name}</div>
                <div className="tag">{s.category}</div>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="hero-sub">No skills added yet — add some from the admin dashboard.</p>
            )}
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="wrap">
          <div className="sec-label">// experience.log</div>
          <h2 className="sec-title">Where I've worked</h2>
          {experience.map((e) => (
            <div className="exp-item" key={e._id}>
              <div className="exp-date">{e.startDate} — {e.endDate}</div>
              <div>
                <div className="exp-role">{e.role}</div>
                <div className="exp-co">@ {e.company}</div>
                <div className="exp-desc">{e.description}</div>
              </div>
            </div>
          ))}
          {experience.length === 0 && (
            <p className="hero-sub">No experience added yet — add some from the admin dashboard.</p>
          )}
        </div>
      </section>

      <section id="projects">
        <div className="wrap">
          <div className="sec-label"><span className="kw">const</span> projects <span className="kw">=</span> <span className="str">fetch('/api/projects')</span></div>
          <h2 className="sec-title">Selected projects</h2>
          <div className="proj-grid">
            {projects.map((p) => (
              <div className="proj-card" key={p._id}>
                <div className="proj-thumb">
                  {p.image ? <img src={p.image} alt={p.title} /> : "no-image.png"}
                </div>
                <div className="proj-body">
                  <div className="proj-title">{p.title}</div>
                  <div className="proj-desc">{p.description}</div>
                  <div className="proj-tags">
                    {p.tags.map((t) => <span className="stack-tag" key={t}>{t}</span>)}
                  </div>
                  <div className="proj-links">
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live ↗</a>}
                    {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>}
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="hero-sub">No projects added yet — add some from the admin dashboard.</p>
            )}
          </div>
        </div>
      </section>

      <section id="contact" style={{ borderBottom: "none" }}>
        <div className="wrap contact-grid">
          <div>
            <div className="sec-label">// get in touch</div>
            <h2 className="sec-title" style={{ marginBottom: 16 }}>Let's build something.</h2>
            <p className="hero-sub">Have a project in mind or just want to say hi? Reach out through any of these.</p>
          </div>
          <div className="contact-links">
            {content.email && <a className="contact-link" href={`mailto:${content.email}`}>✉  {content.email}</a>}
            {content.githubUrl && <a className="contact-link" href={content.githubUrl} target="_blank" rel="noopener noreferrer">⌥  GitHub</a>}
            {content.linkedinUrl && <a className="contact-link" href={content.linkedinUrl} target="_blank" rel="noopener noreferrer">in  LinkedIn</a>}
            {<a href="/resume.pdf" download="/resume.pdf" className="contact-link" target="_blank" rel="noopener noreferrer">⇩  Download CV (PDF)</a>}
          </div>
        </div>
      </section>

      <footer>© {new Date().getFullYear()} {content.name} — built with the MERN stack &amp; Next.js</footer>
    </div>
  );
}
