import { CheckCircle2 } from "lucide-react";

import { techStack } from "#constants";

const SkillsApp = () => (
  <div className="mobile-page mobile-terminal-page">
    <section className="mobile-terminal-card">
      <p>
        <span>@aditya %</span> show tech stack
      </p>
      <div className="mobile-terminal-status">8 modules loaded successfully</div>
    </section>

    <div className="mobile-card-list">
      {techStack.map((group) => (
        <section key={group.category} className="mobile-skill-card">
          <div>
            <CheckCircle2 size={18} />
            <h2>{group.category}</h2>
          </div>
          <p>{group.items.join(", ")}</p>
        </section>
      ))}
    </div>
  </div>
);

export default SkillsApp;
