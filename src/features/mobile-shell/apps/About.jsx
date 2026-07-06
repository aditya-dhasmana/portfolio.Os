import { locations } from "#constants";

const aboutFile = locations.about.children.find((item) => item.fileType === "txt");
const photos = locations.about.children.filter((item) => item.fileType === "img");

const AboutApp = () => (
  <div className="mobile-page mobile-about-page">
    <section className="mobile-hero-card">
      <img src="/images/gal/circlesunset1.png" alt="Aditya" />
      <div>
        <p>Frontend Developer</p>
        <h1>Aditya Dhasmana</h1>
      </div>
    </section>

    <section className="mobile-section">
      <h2>{aboutFile?.subtitle || "Meet the Developer Behind the Code"}</h2>
      <div className="mobile-copy-stack">
        {(aboutFile?.description || []).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>

    <section className="mobile-photo-strip" aria-label="Profile photos">
      {photos.map((photo) => (
        <img key={photo.id} src={photo.imageUrl} alt={photo.name} />
      ))}
    </section>
  </div>
);

export default AboutApp;
