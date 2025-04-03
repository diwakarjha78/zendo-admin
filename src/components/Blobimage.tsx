import React, { useEffect, useState } from 'react';

interface BlobimageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const Blobimage: React.FC<BlobimageProps> = ({ src, className = '', ...props }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        if (isMounted) {
          const imageUrl = URL.createObjectURL(blob);
          setImageSrc(imageUrl);
        }
      })
      .catch((err) => console.error('Image Fetch Error:', err));

    return () => {
      isMounted = false;
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [src]);

  if (!imageSrc) return <div className={`bg-gray-200 animate-pulse ${className}`} {...props} />;

  return <img src={imageSrc} className={`${className}`} {...props} />;
};

export default Blobimage;
