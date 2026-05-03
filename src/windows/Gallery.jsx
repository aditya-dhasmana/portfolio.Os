import React, { useState } from "react";
import windowWrapper from "#hoc/windowWrapper";
import { WindowControls, OptimizedImage } from "#components/Index";
import { photosLinks, gallery } from "#constants";
import { useWindowStore } from "#store";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Download, Heart, Share2, Grid, List } from "lucide-react";

const Gallery = () => {
  const { openWindow } = useWindowStore();
  const [activeTab, setActiveTab] = useState("Library");
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [likedImages, setLikedImages] = useState(new Set());

  const openImage = (img) => {
    setSelectedImage(img);
  };

  const toggleLike = (imgId) => {
    setLikedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imgId)) {
        newSet.delete(imgId);
      } else {
        newSet.add(imgId);
      }
      return newSet;
    });
  };

  const downloadImage = (img) => {
    const link = document.createElement('a');
    link.href = img.img;
    link.download = `gallery-image-${img.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareImage = async (img) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Gallery Image ${img.id}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  return (
    <>
      <div id="window-header">
        <WindowControls target="photos" />
        <h2>Gallery</h2>
      </div>

      <div className="gallery-container">
        
        {/* SIDEBAR */}
        <div className="gallery-sidebar">
          <div className="sidebar-header">
            <h2>Library</h2>
            <div className="sidebar-nav">
              <ul>
                {photosLinks.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => setActiveTab(item.title)}
                    className={`nav-item ${activeTab === item.title ? 'active' : ''}`}
                  >
                    <OptimizedImage src={item.icon} alt={item.title} className="nav-icon" />
                    <p className="nav-text">{item.title}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <div className="toggle-buttons">
              <button
                onClick={() => setViewMode("grid")}
                className={`toggle-btn ${viewMode === "grid" ? 'active' : ''}`}
              >
                <Grid size={16} />
                <span className="toggle-text">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`toggle-btn ${viewMode === "list" ? 'active' : ''}`}
              >
                <List size={16} />
                <span className="toggle-text">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="gallery-content">
          {activeTab === "Library" && (
            <div className="content-header">
              <div className="header-title">
                <h3>My Gallery</h3>
                <p>{gallery.length} photos</p>
              </div>

              {viewMode === "grid" ? (
                <div className="gallery-grid">
                  {gallery.map((img) => (
                    <motion.div
                      key={img.id}
                      whileHover={{ y: -4 }}
                      className="gallery-item"
                      onClick={() => openImage(img)}
                    >
                      <div className="image-container">
                        <OptimizedImage
                          src={img.img}
                          alt={`Gallery image ${img.id}`}
                          className="gallery-image"
                        />
                        <div className="image-overlay" />
                        
                        {/* Overlay Actions */}
                        <div className="overlay-actions">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="zoom-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openImage(img);
                            }}
                          >
                            <ZoomIn size={20} className="zoom-icon" />
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Image Info */}
                      <div className="image-info">
                        <div className="info-row">
                          <span className="image-name">Photo {img.id}</span>
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(img.id);
                              }}
                              className={`like-btn ${likedImages.has(img.id) ? 'liked' : ''}`}
                            >
                              <Heart size={16} fill={likedImages.has(img.id) ? 'currentColor' : 'none'} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="gallery-list">
                  {gallery.map((img) => (
                    <motion.div
                      key={img.id}
                      whileHover={{ x: 4 }}
                      className="list-item"
                      onClick={() => openImage(img)}
                    >
                      <div className="list-image">
                        <OptimizedImage
                          src={img.img}
                          alt={`Gallery image ${img.id}`}
                        />
                      </div>
                      <div className="list-info">
                        <h4>Photo {img.id}</h4>
                        <p>Click to view full size</p>
                      </div>
                      <div className="list-actions">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(img.id);
                          }}
                          className={`list-like-btn ${likedImages.has(img.id) ? 'liked' : ''}`}
                        >
                          <Heart size={18} fill={likedImages.has(img.id) ? 'currentColor' : 'none'} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(img);
                          }}
                          className="download-btn"
                        >
                          <Download size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab !== "Library" && (
            <div className="empty-state">
              <div className="empty-content">
                <div className="empty-icon">
                  <Grid size={32} />
                </div>
                <h3>{activeTab}</h3>
                <p>This collection is coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="image-modal"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="modal-header">
                <h3>Photo {selectedImage.id}</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="modal-body">
                <div className="modal-image-container">
                  <OptimizedImage
                    src={selectedImage.img}
                    alt={`Gallery image ${selectedImage.id}`}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <div className="footer-left">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleLike(selectedImage.id)}
                    className={`modal-like-btn ${likedImages.has(selectedImage.id) ? 'liked' : ''}`}
                  >
                    <Heart size={18} fill={likedImages.has(selectedImage.id) ? 'currentColor' : 'none'} />
                    <span>{likedImages.has(selectedImage.id) ? 'Liked' : 'Like'}</span>
                  </motion.button>
                </div>
                <div className="footer-right">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downloadImage(selectedImage)}
                    className="modal-download-btn"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareImage(selectedImage)}
                    className="modal-share-btn"
                  >
                    <Share2 size={18} />
                    <span>Share</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default windowWrapper(Gallery, "photos");