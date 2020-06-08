import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FormGroup,
  Input,
  FormFeedback,
  Label,
  Button,
  Modal,
  ModalBody,
} from "reactstrap";
import { User } from "context/user";
import { Link } from "react-router-dom";
// editor
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import LinkTool from "@editorjs/link";
import "../style.scss";
import axios from "axios";
const CreateProject = () => {
  const upload = useRef(null);
  const { user } = useContext(User);
  const [data, setData] = useState({ nonprofit: false });
  const [error, setError] = useState({});
  const [disabled, disable] = useState(false);
  const [category, setCategory] = useState(null);
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [modal, setModal] = useState(false);
  const [video, setVideo] = useState(null);
  useEffect(() => {
    axios.get("/api/project/category").then((res) => {
      setCategory(res.data.result);
      setData({ ...data, category: res.data.result[0].category._id });
    });
    return () => {
      setCategory(null);
      setData({ nonprofit: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {}, [user]);
  const Editor = () => {
    const [editor, setEditor] = useState(null);
    useEffect(() => {
      setEditor(
        new EditorJS({
          holder: "editor_js",
          autofocus: true,
          tools: {
            header: {
              class: Header,
              inlineToolbar: ["link"],
              config: {
                placeholder: "Header",
              },
              shortcut: "CMD+SHIFT+H",
            },
            image: {
              class: ImageTool,
              config: {
                endpoints: {
                  byFile: "/api/project/media", // Your backend file uploader endpoint
                  // byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
                },
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
              shortcut: "CMD+SHIFT+L",
            },
            marker: {
              inlineToolbar: true,
              class: Marker,
              shortcut: "CMD+SHIFT+M",
            },
            code: {
              inlineToolbar: true,
              class: CodeTool,
              shortcut: "CMD+SHIFT+C",
            },
            linkTool: LinkTool,
            embed: Embed,
          },
          data: data.content,
          onChange: (e) => {
            console.log("Now I know that Editor's content changed!", e);
          },
        })
      );
      return () => {
        if (editor)
          editor.isReady.then(() => {
            editor.destroy();
          });
      };
    }, []);
    return (
      <div className="medium-10">
        <h4 className="text-center fs-16">Төслийн дэлгэрэнгүй</h4>
        <div id="editor_js"></div>
        <div className={`invalid-feedback ${error.content ? "d-block" : ""}`}>
          {error.content}
        </div>
        <div className="project-action mb-3">
          <Button
            color="primary"
            block
            className="project-create-btn mt-3"
            disabled={disabled}
            onClick={() => {
              editor
                .save()
                .then((result) => {
                  setData({ ...data, content: result.blocks });
                  if (result.blocks.length === 0)
                    setError({ ...error, content: "Enter your story" });
                  else {
                    disable(true);
                    const { current } = upload;
                    const save = new FormData();
                    if (video) save.append("video", video);
                    else save.append("file", current.files[0]);
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
                })
                .catch((err) => {
                  setError({ ...error, content: "Saving error : " + err });
                });
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
      </div>
    );
  };
  return (
    <div className="project-row p-rem">
      {user && user.email_verified_at ? (
        <div className="create-project">
          {
            {
              1: (
                <div className="medium-10">
                  <h5 className="text-center pt-2 project-title">
                    Шинэ төсөл үүсгэх
                  </h5>
                  <FormGroup>
                    <Input
                      type="text"
                      name="amount"
                      placeholder="Төсөлд шаардагдах мөнгөн дүн"
                      className="input-round"
                      required={true}
                      defaultValue={data.amount}
                      onKeyUp={(e) => {
                        var value = e.target.value;
                        var regex = new RegExp(
                          /^(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?$/
                        );
                        setError({ ...error, amount: "" });
                        if (parseInt(value) < 9999 || !regex.test(value)) {
                          disable(true);
                          setError({
                            ...error,
                            amount: "Төслийнхөө үнийн дүнг зөв оруулна уу.",
                          });
                        } else disable(false);
                        setData({
                          ...data,
                          [e.target.name]:
                            value.length < 1 ? "" : parseInt(value),
                        });
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
                      placeholder="Төслийн нэр"
                      className="input-round"
                      defaultValue={data.title}
                      maxLength="50"
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
                      defaultValue={data.category}
                      onChange={(e) => {
                        setData({ ...data, [e.target.name]: e.target.value });
                      }}
                    >
                      <option value="-1" disabled>
                        Төслийн төрөл
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
                    <h5 className="project-profit">
                      Та цуглуулсан хөрөнгөө хэнд зориулах вэ?
                    </h5>
                    <div>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="radio"
                            name="nonprofit"
                            defaultChecked={!data.nonprofit}
                            onClick={() => {
                              setData({ ...data, nonprofit: false });
                            }}
                          />{" "}
                          Өөртөө болон бусад хүмүүст
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="radio"
                            name="nonprofit"
                            defaultChecked={data.nonprofit}
                            onClick={() => {
                              setData({ ...data, nonprofit: true });
                            }}
                          />{" "}
                          Ашгийн бус
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="terms text-muted">
                      Тухайн төсөлд анхны хөрөнгө оруулалт хийгдсэний дараагаар
                      төслийн нэр, хүсэж буй хэмжээ, төрөл, зэрэг нь солигдох
                      боломжгүй тул та төслийнхөө мэдээллийг үнэн зөв бөглөнө
                      үү.
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
                            amount: "Төслийнхөө үнийн дүнг зөв оруулна уу",
                          });
                        else if (!data.title)
                          setError({
                            ...error,
                            title: "`Төслийн нэрээ оруулна уу.`",
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
                    Төслийн зураг
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
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <Button
                        color="primary"
                        block
                        className="project-create-btn mt-3"
                        onClick={() => {
                          upload.current.value = null;
                          upload.current.click();
                          setVideo(null);
                          setData({ ...data, video: null });
                        }}
                      >
                        Зураг байршуулах
                      </Button>
                      <Button
                        color="secondary"
                        block
                        className="project-create-btn mt-3"
                        onClick={() => setModal(true)}
                      >
                        Youtube бичлэг холбох
                      </Button>
                    </>
                  )}
                  <div
                    className={`invalid-feedback ${
                      error.cover ? "d-block" : ""
                    }`}
                  >
                    {error.cover}
                  </div>
                  <div className="project-action mb-3">
                    {preview ? (
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
                    ) : null}
                    <button
                      className="btn btn-link mt-2 w-100"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                  </div>
                </div>
              ),
              3: <Editor />,
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
                reader.onload = (e) => {
                  setPreview(e.target.result);
                };
                reader.readAsDataURL(file);
              } else setError({ ...error, cover: "Invalid image" });
            }}
            accept="image/x-png,image/jpeg"
          />
        </div>
      ) : (
        <div className="text-center verify-email d-flex flex-column">
          <span className="material-icons material-icons-two-tone">
            mark_email_read
          </span>
          Please verify your email address
          <br />
          <Link to="/settings/email">
            Click here to verify your email address
          </Link>
        </div>
      )}
      <Modal
        isOpen={modal}
        className="youtube-modal create-project"
        fade={false}
      >
        <ModalBody>
          <h5 className="text-center">Youtube дэх бичлэг нэмэх</h5>
          <FormGroup className="mt-3">
            <Input
              type="url"
              name="video"
              placeholder="Youtube дэх бичлэгийн холбоос"
              className="input-round"
              defaultValue={data.video}
              required={true}
              onChange={(e) => {
                setVideo(null);
                setError({});
                setData({ ...data, [e.target.name]: e.target.value });
              }}
              invalid={error.video ? true : false}
              autoComplete="off"
            />
            <FormFeedback>{error.video}</FormFeedback>
          </FormGroup>
          {video ? (
            <>
              <iframe
                src={"https://www.youtube.com/embed/" + video}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="youtube player"
                className="yt-iframe"
              />
              <Button
                color="primary"
                block
                className="project-create-btn mt-3"
                onClick={() => {
                  setModal(false);
                  setStep(3);
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                color="primary"
                block
                className="project-create-btn mt-3"
                onClick={() => {
                  const youtube = (url) => {
                    var match = url.match(
                      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=|\?v=)([^#]*).*/
                    );
                    return match && match[2].length === 11 ? match[2] : false;
                  };
                  if (youtube(data.video)) {
                    setVideo(youtube(data.video));
                  } else setError({ ...error, video: "Алдаатай холбоос" });
                }}
              >
                Next
              </Button>
            </>
          )}

          <p className="text-muted f-13 mt-3">
            Хэрвээ та утаснаасаа бичлэг оруулахыг хүсч байвал эхлээд уг бичлэгээ
            Youtube-д байршуулсан байх шаардлагатай.
          </p>
          <Button color="link" block onClick={() => setModal(false)}>
            Back
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};
export default CreateProject;
