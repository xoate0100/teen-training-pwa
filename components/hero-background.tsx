'use client';

import React from 'react';
import { VisualAssetsService } from '@/lib/services/visual-assets-service';
import { cn } from '@/lib/utils';

interface HeroBackgroundProps {
  context: 'dashboard' | 'session' | 'progress';
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  fallbackColor?: string;
}

export function HeroBackground({
  context,
  children,
  className,
  overlay = true,
  overlayOpacity = 0.4,
  fallbackColor = 'bg-gradient-to-r from-blue-600 to-purple-600',
}: HeroBackgroundProps) {
  const asset = VisualAssetsService.getHeroBackground(context);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    if (asset) {
      // Check if image exists
      VisualAssetsService.assetExists(asset).then(exists => {
        if (!exists) {
          setImageError(true);
        }
      });
    }
  }, [asset]);

  const backgroundStyle = React.useMemo(() => {
    if (!asset || imageError) {
      return {};
    }

    return VisualAssetsService.getBackgroundStyle(asset, {
      overlay: false, // We'll handle overlay with CSS
      position: 'center',
      size: 'cover',
    });
  }, [asset, imageError]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        !imageLoaded && !imageError && fallbackColor,
        className
      )}
      style={imageLoaded && !imageError ? backgroundStyle : {}}
    >
      {/* Background Image */}
      {asset && !imageError && (
        <img
          src={asset.path}
          alt={asset.alt}
          className='absolute inset-0 w-full h-full object-cover'
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div
          className='absolute inset-0 bg-black'
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className={cn('relative z-10', overlay && 'text-white')}>
        {children}
      </div>
    </div>
  );
}

interface SessionCardBackgroundProps {
  sessionType: 'strength' | 'volleyball' | 'plyometric' | 'recovery';
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export function SessionCardBackground({
  sessionType,
  children,
  className,
  overlay = true,
  overlayOpacity = 0.3,
}: SessionCardBackgroundProps) {
  const asset = VisualAssetsService.getSessionBackground(sessionType);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    if (asset) {
      VisualAssetsService.assetExists(asset).then(exists => {
        if (!exists) {
          setImageError(true);
        }
      });
    }
  }, [asset]);

  const backgroundStyle = React.useMemo(() => {
    if (!asset || imageError) {
      return {};
    }

    return VisualAssetsService.getBackgroundStyle(asset, {
      overlay: false,
      position: 'center',
      size: 'cover',
    });
  }, [asset, imageError]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={cn(
        'relative w-full h-full rounded-lg overflow-hidden',
        !imageLoaded &&
          !imageError &&
          'bg-gradient-to-br from-gray-200 to-gray-300',
        className
      )}
      style={imageLoaded && !imageError ? backgroundStyle : {}}
    >
      {/* Background Image */}
      {asset && !imageError && (
        <img
          src={asset.path}
          alt={asset.alt}
          className='absolute inset-0 w-full h-full object-cover'
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div
          className='absolute inset-0 bg-black'
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-10 h-full flex flex-col justify-end p-4',
          overlay && 'text-white'
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface VisualAssetDisplayProps {
  assetId: string;
  className?: string;
  showDescription?: boolean;
}

export function VisualAssetDisplay({
  assetId,
  className,
  showDescription = false,
}: VisualAssetDisplayProps) {
  const asset = VisualAssetsService.getAssetById(assetId);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    if (asset) {
      VisualAssetsService.assetExists(asset).then(exists => {
        if (!exists) {
          setImageError(true);
        }
      });
    }
  }, [asset]);

  if (!asset) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-200 text-gray-500',
          className
        )}
      >
        Asset not found: {assetId}
      </div>
    );
  }

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-200 text-gray-500',
          className
        )}
      >
        <div className='text-center'>
          <div className='text-sm font-medium'>Image not available</div>
          {showDescription && (
            <div className='text-xs text-gray-400 mt-1'>
              {asset.description}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <img
        src={asset.path}
        alt={asset.alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      {!imageLoaded && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-200'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
        </div>
      )}
      {showDescription && (
        <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs'>
          {asset.description}
        </div>
      )}
    </div>
  );
}
