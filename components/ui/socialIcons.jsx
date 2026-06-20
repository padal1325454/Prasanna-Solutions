import { FaInstagram, FaYoutube, FaSpotify } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Single source of truth for social icons used across the site
export const SOCIAL_ICON = {
  Instagram: FaInstagram,
  YouTube:   FaYoutube,
  Spotify:   FaSpotify,
  X:         FaXTwitter,
  Twitter:   FaXTwitter,
};

export function SocialIcon({ label, size = 18, ...rest }) {
  const Icon = SOCIAL_ICON[label];
  if (!Icon) return null;
  return <Icon size={size} aria-hidden {...rest} />;
}
