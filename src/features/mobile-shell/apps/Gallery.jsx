import { useState } from "react";
import { X } from "lucide-react";

import { gallery } from "#constants";

const GalleryApp = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mobile-page">
      <section className="mobile-section">
        <h1>Gallery</h1>
        <p className="mobile-muted">A compact photo roll for the portfolio.</p>
      </section>

      <div className="mobile-gallery-grid">
        {gallery.map((item) => (
          <button key={item.id} type="button" onClick={() => setSelected(item)}>
            <img src={item.img} alt={`Gallery item ${item.id}`} />
          </button>
        ))}
      </div>

      {selected && (
        <div className="mobile-lightbox" role="dialog" aria-modal="true">
          <button type="button" onClick={() => setSelected(null)} aria-label="Close preview">
            <X size={20} />
          </button>
          <img src={selected.img} alt={`Gallery item ${selected.id}`} />
        </div>
      )}
    </div>
  );
};

export default GalleryApp;
