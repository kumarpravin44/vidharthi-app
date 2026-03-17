import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import herobanner from "../images/banner.png";
import { notificationService } from "../services/notificationService";

function HeroBanner() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const data = await notificationService.getBanners();
      if (data && data.length > 0) {
        setBanners(data);
      }
    } catch (error) {
      console.error('Failed to load banners:', error);
      // Fallback to default banner if API fails
    }
  };

  // Auto-slide banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const handleBannerClick = () => {
    if (banners.length === 0) return;
    
    const currentBanner = banners[currentIndex];
    if (!currentBanner.link_url) return;

    const url = currentBanner.link_url;
    
    // Check if it's an external URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      // Internal route - use React Router navigation
      navigate(url);
    }
  };

  const currentBanner = banners.length > 0 ? banners[currentIndex] : null;
  const hasLink = currentBanner && currentBanner.link_url;

  return (
    <div 
      className="hero-banner" 
      onClick={handleBannerClick}
      style={{ cursor: hasLink ? 'pointer' : 'default' }}
    >
      {banners.length > 0 ? (
        <img 
          src={currentBanner.image_url || herobanner} 
          alt={currentBanner.title || "Banner"} 
        />
      ) : (
        <img src={herobanner} alt="Banner" />
      )}
    </div>
  );
}

export default HeroBanner;