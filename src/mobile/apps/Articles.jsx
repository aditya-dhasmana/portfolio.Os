import { MoveRight, Search } from "lucide-react";

import { blogPosts } from "#constants";

const ArticlesApp = () => (
  <div className="mobile-page mobile-articles-page">
    <div className="mobile-search-field">
      <Search size={16} />
      <span>Search articles</span>
    </div>

    <section className="mobile-section">
      <h1>Developer Articles</h1>
      <p className="mobile-muted">Notes and guides worth keeping close while building.</p>
    </section>

    <div className="mobile-card-list">
      {blogPosts.map((post) => (
        <a key={post.id} className="mobile-article-card" href={post.link} target="_blank" rel="noreferrer">
          <img src={post.image} alt={post.title} />
          <div>
            <p>{post.date}</p>
            <h2>{post.title}</h2>
            <span>
              Read article <MoveRight size={15} />
            </span>
          </div>
        </a>
      ))}
    </div>
  </div>
);

export default ArticlesApp;
