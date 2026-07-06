/**
 * PURPOSE:
 * Provide stable project data when live GitHub data is unavailable.
 * RESPONSIBILITY:
 * Define the minimum repository-shaped data needed to keep portfolio views usable.
 * USED BY:
 * The portfolio Work-folder builder and GitHub-powered code views.
 * DEPENDS ON:
 * Public portfolio and GitHub URLs only.
 * SHOULD NOT HANDLE:
 * API requests, tokens, loading state, UI rendering, or GitHub response validation.
 * SCALING NOTES:
 * Keep this list intentionally small; move richer project content to a CMS only if editing needs grow.
 */

const username = "aditya-dhasmana";

export const fallbackProjects = [
  {
    id: `${username}/Macfolio`,
    name: "Macfolio",
    full_name: `${username}/Macfolio`,
    description: "Interactive macOS-style portfolio built with React.",
    html_url: `https://github.com/${username}/Macfolio`,
    homepage: "",
    owner: { login: username },
  },
  {
    id: `${username}/Portfolio`,
    name: "Portfolio",
    full_name: `${username}/Portfolio`,
    description: "Frontend portfolio projects and UI experiments.",
    html_url: `https://github.com/${username}?tab=repositories`,
    homepage: "",
    owner: { login: username },
  },
  {
    id: `${username}/React Projects`,
    name: "React Projects",
    full_name: `${username}/React Projects`,
    description: "React practice projects available from GitHub.",
    html_url: `https://github.com/${username}?tab=repositories`,
    homepage: "",
    owner: { login: username },
  },
];
