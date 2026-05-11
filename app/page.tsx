import { fetchProjects, fetchTerminalCommands, fetchSiteConfig, fetchSkills, fetchExperience } from "@/lib/data";
import Nav from "@/components/sections/nav";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import ProjectsSection from "@/components/sections/projects";
import Experience from "@/components/sections/experience";
import Footer from "@/components/sections/footer";

export default async function Home() {
  const [projects, terminalCommands, siteConfig, skills, experience] = await Promise.all([
    fetchProjects(),
    fetchTerminalCommands(),
    fetchSiteConfig(),
    fetchSkills(),
    fetchExperience(),
  ]);

  return (
    <main>
      <Nav />
      <Hero config={siteConfig} />
      <About config={siteConfig} commands={terminalCommands} />
      <Skills skills={skills} />
      <ProjectsSection projects={projects} />
      <Experience experience={experience} />
      <Footer />
    </main>
  );
}
