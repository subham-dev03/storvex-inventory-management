import { Boxes } from "lucide-react";
export default function Logo({ light = false }) {
  return <div className={`logo ${light ? "logo-light" : ""}`}><span className="logo-mark"><Boxes size={20}/></span><span>Stor<span className="logo-accent">vex</span></span></div>;
}
