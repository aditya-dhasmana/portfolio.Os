import React from "react";
import { WindowControls } from "#components/Index";
import windowWrapper from "#hoc/windowWrapper";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MoveRight,
  PanelLeft,
  Plus,
  Search,
  Share,
  ShieldHalf,
} from "lucide-react";
import { blogPosts } from "#constants";

// eslint-disable-next-line react-refresh/only-export-components
const Safari = () => {
  return (
    <>
      <div id="window-header">
        <div className="flex items-center gap-3">
          <WindowControls target="safari" />
          <PanelLeft className="icon" />
          <ChevronLeft className="icon" />
          <ChevronRight className="icon" />
        </div>

        <div className="flex-1 flex justify-center">
          <div className="search">
            <ShieldHalf className="icon" />
            <Search className="icon" />
            <input type="text" placeholder="Search or enter website name" className="flex-1" />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Share className="icon" />
          <Plus className="icon" />
          <Copy className="icon" />
        </div>
      </div>

      <div className="blog">
        <h2>My Developer Blog</h2>

        <div className="space-y-8">
          {blogPosts.map(({ id, title, image, date, link }) => (
            <div key={id} className="blog-post">
              <div className="col-span-2">
                <img src={image} alt={title} />
              </div>

              <div className="content">
                <p>{date}</p>
                <h3>{title}</h3>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  check out the full post
                  <MoveRight className="icon-hover" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default windowWrapper(Safari, "safari");
