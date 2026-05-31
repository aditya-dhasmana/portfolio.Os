import { socials } from "#constants";

const ContactApp = () => (
  <div className="mobile-page">
    <section className="mobile-contact-hero">
      <img src="/images/adrian.jpg" alt="Aditya" />
      <h1>Let's Connect</h1>
      <p>Got an idea, a bug to squash, or just want to talk through a build?</p>
    </section>

    <div className="mobile-card-list">
      {socials.map((social) => (
        <a
          key={social.id}
          className="mobile-social-row"
          href={social.link}
          target="_blank"
          rel="noreferrer"
          style={{ "--accent": social.bg }}
        >
          <span>
            <img src={social.icon} alt="" />
          </span>
          <strong>{social.text}</strong>
        </a>
      ))}
    </div>
  </div>
);

export default ContactApp;
