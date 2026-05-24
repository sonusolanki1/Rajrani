import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCcw, Maximize, Crop } from 'lucide-react';

const ImageCropper = ({ image, onCropComplete, onCancel, aspect = 4/5 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [mode, setMode] = useState('crop'); // 'crop' or 'fit'
  const [bgColor, setBgColor] = useState('#ffffff');

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);
  const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getProcessedImg = async () => {
    const originalImage = await createImage(image);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Target dimensions based on aspect ratio
    // We'll use 1200 as base width for high quality
    const targetWidth = 1200;
    const targetHeight = targetWidth / aspect;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    if (mode === 'crop') {
      // Draw cropped area
      const { x, y, width, height } = croppedAreaPixels;
      ctx.drawImage(
        originalImage,
        x, y, width, height,
        0, 0, targetWidth, targetHeight
      );
    } else {
      // Fit mode: calculate scaling to fit the whole image
      const imgWidth = originalImage.width;
      const imgHeight = originalImage.height;
      const imgAspect = imgWidth / imgHeight;
      const targetAspect = targetWidth / targetHeight;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgAspect > targetAspect) {
        // Image is wider than frame
        drawWidth = targetWidth;
        drawHeight = targetWidth / imgAspect;
        drawX = 0;
        drawY = (targetHeight - drawHeight) / 2;
      } else {
        // Image is taller than frame
        drawHeight = targetHeight;
        drawWidth = targetHeight * imgAspect;
        drawX = (targetWidth - drawWidth) / 2;
        drawY = 0;
      }

      ctx.drawImage(originalImage, drawX, drawY, drawWidth, drawHeight);
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
  };

  const handleDone = async () => {
    try {
      const blob = await getProcessedImg();
      onCropComplete(blob);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10">
      <div className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden flex flex-col h-[90vh] md:h-[80vh]">
        {/* Header */}
        <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-1 block">Image Studio</span>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Refine Presentation</h2>
          </div>
          <button onClick={onCancel} className="p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-black hover:text-white transition-all active:scale-90"><X size={20}/></button>
        </div>

        {/* Workspace */}
        <div className="relative flex-grow bg-gray-50 flex flex-col md:flex-row overflow-hidden">
          {/* Main Editor */}
          <div className="relative flex-grow bg-gray-900 overflow-hidden">
            {mode === 'crop' ? (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={onCropChange}
                onCropComplete={onCropCompleteInternal}
                onZoomChange={onZoomChange}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-10">
                <div 
                  className="relative shadow-2xl transition-all duration-500"
                  style={{ 
                    aspectRatio: aspect, 
                    backgroundColor: bgColor,
                    height: '100%',
                    maxHeight: '100%',
                    width: 'auto'
                  }}
                >
                  <img src={image} className="w-full h-full object-contain p-2" alt="Preview" />
                </div>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="w-full md:w-80 bg-white border-l border-gray-100 p-6 md:p-8 flex flex-col gap-8 overflow-y-auto">
            {/* Mode Selector */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Edit Mode</label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-50 rounded-2xl">
                <button 
                  onClick={() => setMode('crop')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'crop' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Crop size={14} /> Crop
                </button>
                <button 
                  onClick={() => setMode('fit')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'fit' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Maximize size={14} /> Fit
                </button>
              </div>
            </div>

            {mode === 'crop' ? (
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Zoom Level</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <button 
                  onClick={() => setZoom(1)}
                  className="w-full py-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <RotateCcw size={12} /> Reset Zoom
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Background Canvas</label>
                <div className="grid grid-cols-4 gap-3">
                  {['#ffffff', '#000000', '#f3f4f6', '#fef2f2'].map(color => (
                    <button 
                      key={color}
                      onClick={() => setBgColor(color)}
                      className={`aspect-square rounded-full border-2 transition-all ${bgColor === color ? 'border-black scale-110 shadow-lg' : 'border-gray-100 hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div className="relative aspect-square">
                    <input 
                      type="color" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <div className="w-full h-full rounded-full border-2 border-gray-100 bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 flex items-center justify-center text-[8px] text-white font-black uppercase">Custom</div>
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed mt-2 italic">Fitting ensures your entire product is visible without cutting anything off.</p>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-gray-50">
              <button 
                onClick={handleDone}
                className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:translate-y-[-2px] active:translate-y-0 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-3"
              >
                <Check size={18} /> Apply Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
