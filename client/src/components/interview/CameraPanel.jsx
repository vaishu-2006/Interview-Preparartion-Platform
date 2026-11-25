import ConfidenceIndicator from './ConfidenceIndicator';

const CameraPanel = ({ videoRef, webcamStatus, webcamError, micActive, faceSample, faceStatus, onRetryCamera }) => (
  <div className="card overflow-hidden">
    <div className="relative aspect-video bg-black">
      <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />

      {webcamStatus !== 'active' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/95 p-6 text-center">
          {webcamStatus === 'requesting' && <p className="text-sm text-ink-2">Requesting camera access...</p>}
          {webcamStatus === 'denied' && (
            <>
              <p className="text-sm font-medium text-danger">Camera access denied</p>
              <p className="text-xs text-ink-3">{webcamError}</p>
              <button onClick={onRetryCamera} className="btn-secondary mt-2 text-sm">Try Again</button>
            </>
          )}
          {webcamStatus === 'unavailable' && (
            <>
              <p className="text-sm font-medium text-gold">Camera unavailable</p>
              <p className="text-xs text-ink-3">{webcamError}</p>
            </>
          )}
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
        <span className={`h-2 w-2 rounded-full ${micActive ? 'bg-brand-500' : 'bg-danger'}`} />
        {micActive ? 'Mic active' : 'Mic off'}
      </div>
    </div>

    <div className="p-4">
      <ConfidenceIndicator sample={faceSample} faceStatus={faceStatus} />
    </div>
  </div>
);

export default CameraPanel;
