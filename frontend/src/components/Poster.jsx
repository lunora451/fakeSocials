import React, { useState, useRef, useEffect } from "react";
import avatar from "../assets/img/avatarDefault.png";
import { TbPhotoPlus } from "react-icons/tb";
import "./styles/poster.css";
import { ImCancelCircle } from "react-icons/im";

const Poster = ({ user, handlePost }) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [textPost, setTextPost] = useState("");
  const [picturePoster, setPicturePoster] = useState(null);
  const [buttonPostEnable, setButtonPostEnable] = useState(
    characterCount !== 0 || textPost.trim().length !== 0
  );
  const maxLengthChar = 140;
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  const searchPicture = () => {
    //photoPicker
  };

  useEffect(() => {
    const isButtonEnabled = characterCount !== 0 || picturePoster !== null;
    setButtonPostEnable(isButtonEnabled);
  }, [characterCount, textPost, picturePoster]);

  const handlePhotoPosterChange = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    console.log("file");

    if (!(file === typeof undefined)) {
      if (name === "picture") {
        setPicturePoster(file);
      }
    }
  };

  const setNullPoster = () => {
    setPicturePoster(null);
    inputRef.current.value = "";
  };

  return (
    <div className="poster">
      <div className="imgUser">
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}${user.picture}` || avatar}
          alt="default avatar profil"
          className="avatarPoster"
        />
      </div>
      <div className="content ml16">
        <span
          ref={spanRef}
          className="invisibleInput"
          contentEditable
          data-placeholder="What's up today??"
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
        <img
          src={picturePoster ? URL.createObjectURL(picturePoster) : null}
          alt="attachment of post"
          className={picturePoster ? "pictureContentHolder" : "hide"}
        />

        <div className="optionPost">
          <div>
            <label htmlFor="imagePoster" className="labelPhotoPoster">
              <TbPhotoPlus className="photoAddPost" onClick={searchPicture} />
              <label />
              <input
                id="imagePoster"
                type="file"
                accept="image/jpeg, image/gif, image/png, image/webp"
                name="picture"
                ref={inputRef}
                onChange={handlePhotoPosterChange}
              />
            </label>
            <div
              id={picturePoster ? "showCancelPicture" : "hide"}
              className="hoverEffectCancelPicture"
              onClick={setNullPoster}
            >
              <ImCancelCircle className="cancelPicture" />
            </div>
          </div>
          <div>
            <p
              className={
                characterCount >= maxLengthChar ? "counterRed" : "counterBlue"
              }
            >
              {characterCount}/{maxLengthChar}
            </p>
            <button
              type="button"
              className={buttonPostEnable ? "justPostIt" : "disabledButton"}
              onClick={() => {
                handlePost(textPost, picturePoster);
                spanRef.current.textContent = "";
                setCharacterCount(0);
                setNullPoster();
              }}
              disabled={!buttonPostEnable}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poster;
