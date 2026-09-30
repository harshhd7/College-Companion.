import React, { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, Check, AlertCircle, Image as ImageIcon, FlipHorizontal } from "lucide-react";

export default function LostFoundCameraModal({ isOpen, onClose, onPhotoCaptured, onFallbackToGallery }) {
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null); // { dataUrl, blob, file }
  const [facingMode, setFacingMode] = useState("environment"); // rear camera default for objects
  const [startingCamera, setStartingCamera] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera stream only after modal is explicitly opened
  const startCamera = async (mode = facingMode) => {
    setStartingCamera(true);
    setCameraError(null);

    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Camera API not supported on this browser");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera start failed:", err);
      let message = "Camera permission was denied or camera is unavailable.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        message = "Camera access denied. Please allow camera permissions in your browser or select an image from your gallery.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        message = "No camera found on this device. Please choose a photo from your gallery.";
      }
      setCameraError(message);
    } finally {
      setStartingCamera(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedPhoto(null);
      startCamera(facingMode);
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleFlipCamera = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `camera_${Date.now()}.jpg`, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        setCapturedPhoto({
          dataUrl,
          blob,
          file,
        });

        // Pause stream during review
        if (stream) {
          stream.getVideoTracks().forEach((t) => (t.enabled = false));
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = true));
    } else {
      startCamera(facingMode);
    }
  };

  const handleAcceptPhoto = () => {
    if (!capturedPhoto) return;
    onPhotoCaptured(capturedPhoto.file, capturedPhoto.dataUrl);
    handleClose();
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedPhoto(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Header */}
        <div className="p-4 bg-stone-950/80 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-emerald-400" />
            <span className="font-serif font-bold text-sm tracking-tight">Take Item Photograph</span>
          </div>

          <div className="flex items-center gap-2">
            {!capturedPhoto && !cameraError && (
              <button
                onClick={handleFlipCamera}
                title="Switch Camera"
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              >
                <FlipHorizontal size={16} />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Viewfinder / Preview Body */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-4 max-w-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-200">{cameraError}</p>
                <p className="text-xs text-stone-400 mt-1">
                  You can still pick a real photograph from your device gallery or files.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    onFallbackToGallery?.();
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <ImageIcon size={15} />
                  <span>Choose from Gallery</span>
                </button>
                <button
                  onClick={() => startCamera(facingMode)}
                  className="w-full py-2 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={13} />
                  <span>Retry Camera</span>
                </button>
              </div>
            </div>
          ) : capturedPhoto ? (
            <div className="relative w-full h-full flex items-center justify-center bg-stone-950">
              <img
                src={capturedPhoto.dataUrl}
                alt="Captured Item Preview"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 border border-stone-700">
                <Check size={13} />
                <span>Captured Preview</span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {startingCamera && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-xs text-stone-300">
                  <RefreshCw size={24} className="animate-spin text-emerald-400 mb-2" />
                  <span>Starting camera viewfinder...</span>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Subtle crosshair guide for framing object */}
              <div className="absolute inset-8 border border-white/25 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[10px] text-white/50 bg-black/40 px-2 py-0.5 rounded-full">
                  Center item in frame
                </span>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3 shrink-0">
          {capturedPhoto ? (
            <>
              <button
                onClick={handleRetake}
                className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} />
                <span>Retake</span>
              </button>
              <button
                onClick={handleAcceptPhoto}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Check size={15} />
                <span>Use This Photo</span>
              </button>
            </>
          ) : !cameraError ? (
            <>
              <button
                onClick={() => {
                  handleClose();
                  onFallbackToGallery?.();
                }}
                className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1.5 py-1 px-2"
              >
                <ImageIcon size={14} />
                <span>Gallery</span>
              </button>

              <button
                onClick={handleCapture}
                disabled={startingCamera || !stream}
                className="w-14 h-14 rounded-full bg-white hover:bg-emerald-400 text-stone-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 disabled:opacity-40 ring-4 ring-white/20"
                title="Capture Photo"
              >
                <div className="w-11 h-11 rounded-full border-2 border-stone-950 flex items-center justify-center">
                  <Camera size={20} />
                </div>
              </button>

              <div className="w-16" />
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={handleClose}
                className="py-2 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
