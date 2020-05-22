import React, { useState, useEffect, useRef } from "react";
import { FormGroup, Input, FormFeedback, Label, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import "./style.scss";
import axios from "axios";
const CreateProject = () => {
  const upload = useRef(null);
  const [data, setData] = useState({ nonprofit: true });
  const [error, setError] = useState({});
  const [disabled, disable] = useState(false);
  const [category, setCategory] = useState(null);
  const [step, setStep] = useState(3);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    axios.get("/api/project/category").then((res) => {
      setCategory(res.data.result);
      setData({ ...data, category: res.data.result[0]._id });
    });
  }, []);
  return (
    <div className="create-project">
      {
        {
          1: (
            <div>
              <h5 className="text-center pt-2">New Campaign</h5>
              <FormGroup>
                <Input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  className="input-round"
                  required={true}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  autoFocus={true}
                  invalid={error.amount ? true : false}
                  autoComplete="off"
                  disabled={disabled}
                />
                <FormFeedback>{error.amount}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Input
                  type="text"
                  name="title"
                  placeholder="Title"
                  className="input-round"
                  required={true}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  invalid={error.title ? true : false}
                  autoComplete="off"
                  disabled={disabled}
                />
                <FormFeedback>{error.title}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Input
                  type="select"
                  name="category"
                  className="input-round"
                  onChange={(e) => {
                    setData({ ...data, [e.target.name]: e.target.value });
                  }}
                >
                  <option value="-1" disabled>
                    Choose a category
                  </option>
                  {category ? (
                    category.map((cat) => {
                      return (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      );
                    })
                  ) : (
                    <option></option>
                  )}
                </Input>
              </FormGroup>
              <div className="mb-3">
                <h5>Who are you raising money for?</h5>
                <div>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="nonprofit"
                        defaultChecked={true}
                        onClick={() => {
                          setData({ ...data, nonprofit: false });
                        }}
                      />{" "}
                      Myself or someone else
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="nonprofit"
                        onClick={() => {
                          setData({ ...data, nonprofit: true });
                        }}
                      />{" "}
                      Nonprofit
                    </Label>
                  </FormGroup>
                </div>
              </div>
              <div className="mb-3">
                <span className="terms text-muted">
                  The platform is free for users. Transaction fee is 2% per
                  donation. By continuing, you agree to the TROTH{" "}
                  <Link to="/terms">Terms.</Link>
                </span>
              </div>
              <div className="project-action mb-3">
                <Button
                  color="primary"
                  block
                  className="project-create-btn"
                  onClick={() => {
                    setError({});
                    if (!data.title)
                      setError({
                        ...error,
                        title: "Please enter a title for your campaign.",
                      });
                    if (!data.amount)
                      setError({
                        ...error,
                        amount: "Please enter a goal amount for your campaign.",
                      });
                    if (data.amount && data.title) setStep(2);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          ),
          2: (
            <div>
              <h5 className="text-center pt-2">Upload Campaign photo</h5>
              {preview ? (
                <>
                  <div className="mc-tile mc-tile--16x9">
                    <div className="mc-tile__content content">
                      <div className="mc-tile__component mc-tile-image">
                        <div className="mc-tile-image__image mc-background mc-background--loaded mc-background--fit-container mc-background--position-x-center mc-background--position-y-center mc-background--size-cover">
                          <div className="mc-background__background-container">
                            <img
                              src={preview}
                              className="mc-background__background"
                              alt="name"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-link pl-0"
                    onClick={() => setPreview(null)}
                  >
                    Remove photo
                  </button>
                </>
              ) : (
                <div
                  className="project-cover"
                  onClick={() => upload.current.click()}
                >
                  <span className="material-icons">add_a_photo</span>
                </div>
              )}
              <div
                className={`invalid-feedback ${error.cover ? "d-block" : ""}`}
              >
                {error.cover}
              </div>
              <div className="project-action mb-3">
                <Button
                  color="primary"
                  block
                  className="project-create-btn mt-3"
                  onClick={() => {
                    if (!preview)
                      setError({ ...error, cover: "Image required" });
                    else setStep(3);
                  }}
                >
                  Next
                </Button>
                <button
                  className="btn btn-link mt-2 w-100"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              </div>
            </div>
          ),
          3: (
            <>
              <h5 className="pt-2 text-center">Tell your story</h5>
              <Editor
                initialValue=""
                apiKey="xqa5rr4g470438lnpu55qo75efenradbjmxtn02addc6utwr"
                init={{
                  height: 300,
                  menubar: false,
                  plugins: "image link",
                  images_upload_base_path: "/api/project/media",
                  images_upload_handler: (blobInfo, success, failure) => {
                    setTimeout(function () {
                      /* no matter what you upload, we will turn it into TinyMCE logo :)*/
                      success(
                        "http://moxiecode.cachefly.net/tinymce/v9/images/logo.png"
                      );
                    }, 2000);
                  },
                  placeholder: "Explain why you're raising money...",
                  toolbar: "bold link image",
                }}
                onEditorChange={(content) => setData({ ...data, content })}
              />
              <div
                className={`invalid-feedback ${error.content ? "d-block" : ""}`}
              >
                {error.content}
              </div>
              <div className="project-action mb-3">
                <Button
                  color="primary"
                  block
                  className="project-create-btn mt-3"
                  onClick={() => {
                    if (!data.content)
                      setError({ ...error, content: "Enter your story" });
                    else alert(data.content);
                  }}
                >
                  Save
                </Button>
                <button
                  className="btn btn-link mt-2 w-100"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
              </div>
            </>
          ),
        }[step]
      }
      <input
        type="file"
        className="d-none"
        ref={upload}
        onChange={(e) => {
          setError({ ...error, cover: "" });
          var file = e.target.files[0];
          var ext;
          file
            ? (ext = file.name
                .substring(file.name.lastIndexOf(".") + 1)
                .toLowerCase())
            : setError({ ...error, cover: "Invalid image" });
          if (file && (ext === "png" || ext === "jpeg" || ext === "jpg")) {
            var reader = new FileReader();
            reader.onload = function (e) {
              setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
          } else setError({ ...error, cover: "Invalid image" });
        }}
        accept="image/x-png,image/jpeg"
      />
    </div>
  );
};
export default CreateProject;
