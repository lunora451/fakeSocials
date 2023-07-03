import React, { useState, useRef, useEffect } from "react";
import "./styles/modalReply.css";
import avatar from "../assets/img/avatarDefault.png";
import { TbPhotoPlus } from "react-icons/tb";
import { toFormattedDateWithHours } from "../utils/date";
import { ImCancelCircle } from "react-icons/im";

const ModalReply = ({ setShowModalReply, updatedPost, handleComment }) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [textPost, setTextPost] = useState("");
  const [pictureReply, setPictureReply] = useState(null);
  const [buttonPostEnable, setButtonPostEnable] = useState(
    characterCount !== 0
  );
  const maxLengthChar = 140;
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const isButtonEnabled = characterCount !== 0 || pictureReply !== null;
    setButtonPostEnable(isButtonEnabled);
  }, [characterCount, textPost, pictureReply]);

  const handlePhotoReplyChange = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];

    if (!(file === typeof undefined)) {
      if (name === "picture") {
        setPictureReply(file);
      }
    }
  };

  const setNullReply = () => {
    setPictureReply(null);
    inputRef.current.value = "";
  };

  return (
    <div
      className="modalReply"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="postReply">
        <img
          src={avatar}
          alt="default avatar profil"
          className="avatarPostReply"
        />
        <div className="rightPostReply">
          <div className="upperPostReply">
            <div className="nameDateDivReply ml16">
              <p className="usernamePostReply">{updatedPost.author.pseudo}</p>
              <p className="datePostReply">
                {toFormattedDateWithHours(updatedPost.createdAt)}
              </p>
            </div>
          </div>
          <p className="contentPostReply ml16">{updatedPost.message}</p>
        </div>
      </div>
      <div className="posterReply">
        <div className="imgUserReply">
          <img
            src={avatar}
            alt="default avatar profil"
            className="avatarPosterReply"
          />
        </div>
        <div className="contentReply ml16">
          <span
            ref={spanRef}
            className="invisibleInputReply"
            contentEditable
            data-placeholder="Comment here..."
            style={{ whiteSpace: "pre-wrap" }}
            onBlur={(e) => (e.target.style.outline = "")}
            onInput={(e) => {
              const content = e.target.textContent;
              if (content.length <= maxLengthChar) {
                setTextPost(content);
                setCharacterCount(content.length);
              } else {
                e.preventDefault();
                e.target.textContent = textPost;
              }
              const span = e.target;
              const spanWidth = span.offsetWidth;
              const contentWidth = span.scrollWidth;

              if (contentWidth > spanWidth) {
                const lastCharacter = span.lastChild;
                if (lastCharacter && lastCharacter.nodeName !== "BR") {
                  span.appendChild(document.createElement("br"));
                }
              }
            }}
          />

          <div className="optionPostReply">
            <div className="pictureContainerReply">
              <label htmlFor="imageReply" className="labelPhotoReply">
                <TbPhotoPlus className="photoAddPostReply" />
                <label />
                <input
                  id="imageReply"
                  type="file"
                  accept="image/jpeg, image/gif, image/png, image/webp"
                  name="picture"
                  ref={inputRef}
                  onChange={handlePhotoReplyChange}
                />
              </label>
              <p className="attachment">
                {pictureReply ? pictureReply.name : ""}
              </p>
              <div
                id={pictureReply ? "showCancelPictureReply" : "hide"}
                className="hoverEffectCancelPictureReply"
                onClick={setNullReply}
              >
                <ImCancelCircle className="cancelPicture" />
              </div>
            </div>
            <div>
              <p
                className={
                  characterCount >= maxLengthChar
                    ? "counterRedReply"
                    : "counterBlueReply"
                }
              >
                {characterCount}/{maxLengthChar}
              </p>
              <button
                type="button"
                className={buttonPostEnable ? "justPostIt" : "disabledButton"}
                onClick={(e) => {
                  handleComment(e, {
                    postId: updatedPost._id,
                    textPost: textPost,
                    picture: pictureReply,
                  });
                  spanRef.current.textContent = "";
                  setCharacterCount(0);
                  setNullReply();
                }}
                disabled={!buttonPostEnable}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default ModalReply;
