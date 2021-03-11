import React, { useEffect, useRef, useState } from "react";
import locales from "../../locales/video";
import ToggleButton from "../shared/ToggleButton";
import "./css/videomodal.scss";

const VideoModal = (props) => {
  const { isCogActive, rate, slowMotion } = props;
  const videoModal = useRef(null);
  const [currentModal, setCurrentModal] = useState("main");
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (videoModal.current && !videoModal.current.contains(event.target)) {
      setCurrentModal("main");
      if (props.controlModal && !event.target.classList.contains("fa-cog")) {
        setCurrentModal("main");
        props.controlModal(false);
      }
    }
  };

  if (currentModal === "playback") {
    return (
      <VideoModalContainer isCogActive={isCogActive} videoModal={videoModal}>
        <PlaybackSpeedContainer
          rate={rate}
          slowMotion={slowMotion}
          onClickMainButton={() => setCurrentModal("main")}
          onClickSecondaryButton={() => setCurrentModal("main")}
        />
      </VideoModalContainer>
    );
  }

  return (
    <VideoModalContainer isCogActive={isCogActive} videoModal={videoModal}>
      <VideoModalItem onClick={props.toggleAutoplay}>
        <ModalItemTitle>{locales.videoPlayer.modal.autoplay}</ModalItemTitle>
        <ToggleButton active={props.autoplay} color="red" />
      </VideoModalItem>

      {props.watermark && (
        <VideoModalItem
          onClick={props.setAnnotations}
          annotations={props.annotations}
        >
          <ModalItemTitle>
            {locales.videoPlayer.modal.annotations}
          </ModalItemTitle>
          <ToggleButton active={props.annotations} color="red" />
        </VideoModalItem>
      )}

      <VideoModalItem onClick={() => setCurrentModal("playback")}>
        <ModalItemTitle>
          {locales.videoPlayer.modal.playbackSpeed}
        </ModalItemTitle>
        <ModalItemTitle>
          {rate === 1 ? locales.videoPlayer.modal.normal : rate}
        </ModalItemTitle>
      </VideoModalItem>
    </VideoModalContainer>
  );
};

const PlaybackSpeedContainer = ({
  onClickMainButton,
  onClickSecondaryButton,
  rate,
  slowMotion,
}) => {
  const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  return (
    <>
      <VideoModalHeader>
        <VideoModalHeaderButton onClick={onClickMainButton}>
          * {locales.videoPlayer.modal.playbackSpeed}
        </VideoModalHeaderButton>
        <VideoModalHeaderSecondaryButton onClick={onClickSecondaryButton}>
          {locales.videoPlayer.modal.custom}
        </VideoModalHeaderSecondaryButton>
      </VideoModalHeader>
      {rates.map((rateItem) => {
        return (
          <VideoModalItem
            onClick={() => {
              slowMotion(rateItem);
              onClickMainButton();
            }}
          >
            {rateItem === rate ? (
              <ModalItemTitle>
                * {rateItem === 1 ? locales.videoPlayer.modal.normal : rateItem}
              </ModalItemTitle>
            ) : (
              <ModalItemTitle>
                {rateItem === 1 ? locales.videoPlayer.modal.normal : rateItem}
              </ModalItemTitle>
            )}
          </VideoModalItem>
        );
      })}
    </>
  );
};

const VideoModalHeader = ({ single, children }) => {
  let className = "video-modal-item-header";
  if (single) className += " single-item";
  return <div className={className}>{children}</div>;
};

const VideoModalHeaderButton = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="modal-item-header-button">
      {children}
    </div>
  );
};

const VideoModalHeaderSecondaryButton = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="modal-item-header-secondary-button">
      {children}
    </div>
  );
};

const VideoModalContainer = ({ videoModal, children, isCogActive }) => {
  let className = "video-options-modal";
  if (!isCogActive) {
    className += " video-options-modal--unactive";
  }
  return (
    <div ref={videoModal} className={className}>
      {children}
    </div>
  );
};

const ModalItemTitle = ({ children, single }) => (
  <span className={`video-modal-item-title${single ? " single-item" : ""}`}>
    {children}
  </span>
);

const VideoModalItem = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className={"video-options-modal-item"}>
      {children}
    </div>
  );
};

export default VideoModal;
