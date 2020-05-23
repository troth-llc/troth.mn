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
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    axios.get("/api/project/category").then((res) => {
      setCategory(res.data.result);
      setData({ ...data, category: res.data.result[0].category._id });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="project-row">
      <div className="create-project">
        {
          {
            1: (
              <div className="medium-10">
                <h5 className="text-center pt-2 project-title">New Campaign</h5>
                <FormGroup>
                  <Input
                    type="text"
                    name="amount"
                    placeholder="Amount"
                    className="input-round"
                    required={true}
                    onKeyUp={(e) => {
                      setError({ ...data, amount: "" });
                      if (
                        isNaN(e.target.value) ||
                        parseInt(data.amount) < 9999
                      ) {
                        disable(true);
                        setError({
                          ...error,
                          amount:
                            "Please enter a valid goal amount for your campaign.",
                        });
                      } else disable(false);
                      setData({ ...data, [e.target.name]: e.target.value });
                    }}
                    autoFocus={true}
                    invalid={error.amount ? true : false}
                    autoComplete="off"
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
                          <option
                            key={cat.category._id}
                            value={cat.category._id}
                          >
                            {cat.category.name}
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
                  <p className="terms text-muted">
                    Тухайн төсөлд анхны хөрөнгө оруулалт хийгдсэний дараагаар
                    төслийн нэр, хүсэж буй хэмжээ, төрөл, зэрэг нь солигдох
                    боломжгүй тул та төслийнхөө мэдээллийг үнэн зөв бөглөнө үү.
                  </p>
                </div>
                <div className="project-action mb-3">
                  <Button
                    color="primary"
                    block
                    className="project-create-btn"
                    disabled={disabled}
                    onClick={() => {
                      setError({});
                      if (
                        isNaN(data.amount) ||
                        data.amount === "" ||
                        parseInt(data.amount) < 9999
                      )
                        setError({
                          ...error,
                          amount:
                            "Please enter a valid goal amount for your campaign.",
                        });
                      else if (!data.title)
                        setError({
                          ...error,
                          title: "Please enter a title for your campaign.",
                        });
                      else setStep(2);
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ),
            2: (
              <div className="medium-10">
                <h5 className="text-center pt-2 project-title">
                  Upload Campaign photo
                </h5>
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
              <div className="medium-10">
                <h5 className="pt-2 pb-2 text-center project-title">
                  Tell your story
                </h5>
                <Editor
                  initialValue=""
                  apiKey="xqa5rr4g470438lnpu55qo75efenradbjmxtn02addc6utwr"
                  init={{
                    height: 300,
                    menubar: false,
                    initialValue: data.content,
                    plugins: "image link autoresize importcss paste",
                    autoresize_bottom_margin: 50,
                    paste_merge_formats: false,
                    image_dimensions: false,
                    image_description: false,
                    images_upload_handler: (blobInfo, success, failure) => {
                      const upload = new FormData();
                      upload.append(
                        "file",
                        blobInfo.blob(),
                        blobInfo.filename()
                      );
                      axios({
                        method: "post",
                        url: "/api/project/media",
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                        data: upload,
                      }).then((response) => {
                        if (response.data.status) success(response.data.src);
                        else failure(response.data.msg);
                      });
                    },
                    content_style:
                      "img { border-radius: 5px; border: 1px solid #ddd; display: block; width: 100%; }",
                    placeholder: "Explain why you're raising money...",
                    toolbar: "bold link image",
                  }}
                  onEditorChange={(content) => setData({ ...data, content })}
                />
                <div
                  className={`invalid-feedback ${
                    error.content ? "d-block" : ""
                  }`}
                >
                  {error.content}
                </div>
                <div className="project-action mb-3">
                  <Button
                    color="primary"
                    block
                    className="project-create-btn mt-3"
                    disabled={disabled}
                    onClick={() => {
                      if (!data.content)
                        setError({ ...error, content: "Enter your story" });
                      else {
                        disable(true);
                        const { current } = upload;
                        const save = new FormData();
                        save.append("file", current.files[0]);
                        save.append("title", data.title);
                        save.append("amount", data.amount);
                        save.append("content", data.content);
                        save.append("nonprofit", data.nonprofit);
                        save.append("category", data.category);
                        axios({
                          method: "post",
                          url: "/api/project/create",
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                          data: save,
                        }).then((response) => {
                          if (response.data.status)
                            window.location.href = "/project";
                          else {
                            let errors = response.data.errors;
                            errors.map((error) =>
                              setError({ [error.param]: error.msg })
                            );
                            disable(false);
                          }
                          disable(false);
                        });
                      }
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
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
    </div>
  );
};
export default CreateProject;
