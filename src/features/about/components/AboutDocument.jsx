/**
 * PURPOSE:
 * Present About Me file data as a readable macOS-style profile document.
 * RESPONSIBILITY:
 * Arrange the profile image, introduction, and biography inside a constrained document surface.
 * USED BY:
 * The text preview window when Finder opens about-me.txt.
 * DEPENDS ON:
 * About file data supplied by the text preview window.
 * SHOULD NOT HANDLE:
 * Window state, Finder routing, standalone image previews, or document fetching.
 * SCALING NOTES:
 * Add About-specific sections here; keep reusable document primitives outside this feature if a third use appears.
 */

const AboutDocument = ({ image, name, subtitle, description = [] }) => (
  <article className="about-document">
    <div className="about-document__profile">
      {image && (
        <div className="about-document__media">
          <img
            src={image}
            alt="Aditya's profile"
            className="about-document__avatar"
            decoding="async"
          />
        </div>
      )}

      <div className="about-document__content">
        <p className="about-document__eyebrow">About Me</p>

        {subtitle && (
          <h3 className="about-document__title">{subtitle}</h3>
        )}

        {description.length > 0 && (
          <div className="about-document__body">
            {description.map((paragraph, index) => (
              <p key={`${name || "about"}-${index}`}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  </article>
);

export default AboutDocument;
