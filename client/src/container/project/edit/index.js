import React, { useState, useEffect, useRef } from "react";
import {
  FormGroup,
  Input,
  FormFeedback,
  Label,
  Button,
  Spinner,
  Modal,
  ModalBody,
} from "reactstrap";
import dompurify from "dompurify";
import "../style.scss";
import axios from "axios";
const ProjectEdit = (props) => {
  const sanitizer = dompurify.sanitize;
  const youtube = (url) => {
    var match = url.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=|\?v=)([^#]*).*/
    );
    return match && match[2].length === 11 ? match[2] : false;
  };
  const upload = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState({});
  const [disabled, disable] = useState(false);
  const [category, setCategory] = useState(null);
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [modal, setModal] = useState(false);
  const [video, setVideo] = useState(null);
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const loadData = () => {
      try {
        axios
          .get("/api/project/view/" + props.match.params.id, {
            cancelToken: source.token,
          })
          .then((res) => {
            setData(res.data.result);
            setPreview(res.data.result.cover);
            if (res.data.result.video) setVideo(youtube(res.data.result.video));
          });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("cancelled");
        } else {
          throw error;
        }
      }
    };
    const loadCategory = () => {
      try {
        axios
          .get("/api/project/category", { cancelToken: source.token })
          .then((res) => {
            setCategory(res.data.result);
          });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("cancelled");
        } else {
          throw error;
        }
      }
    };
    loadData();
    loadCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {}, [category, data]);
  return (
    <div className="project-row p-rem">
      <div className="create-project">
        {data ? (
          {
            1: (
              <div className="medium-10">
                <h5 className="text-center pt-2 project-title">Төсөл засах</h5>
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
                    value={data.category._id}
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
                  Төслийн зураг
                </h5>
                {preview ? (
                  <>
                    {preview && !data.video ? (
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
                    ) : (
                      <iframe
                        src={"https://www.youtube.com/embed/" + video}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="youtube player"
                        className="yt-iframe"
                      />
                    )}
                    <button
                      className="btn btn-link pl-0"
                      onClick={() => {
                        setPreview(null);
                        setVideo(null);
                        setData({ ...data, cover: null });
                      }}
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
                        upload.current.click();
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
                  className={`invalid-feedback ${error.cover ? "d-block" : ""}`}
                >
                  {error.cover}
                </div>
                <div className="project-action mb-3">
                  {preview || video ? (
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
            3: (
              <div className="medium-10">
                <h5 className="pt-2 pb-2 text-center project-title">
                  Төслийн дэлгэрэнгүй
                </h5>

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
                        save.append("_id", data._id);
                        if (current.files[0])
                          save.append("file", current.files[0]);
                        else save.append("cover", data.cover);
                        if (video) save.append("video", video);
                        save.append("title", data.title);
                        save.append("amount", data.amount);
                        save.append("content", data.content);
                        save.append("nonprofit", data.nonprofit);
                        save.append(
                          "category",
                          data.category._id ? data.category._id : data.category
                        );
                        axios({
                          method: "post",
                          url: "/api/project/update",
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
        ) : (
          <div className="text-center w-100 p-3">
            <Spinner color="secondary" size="sm" />
          </div>
        )}
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
      {data ? (
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
              Хэрвээ та утаснаасаа бичлэг оруулахыг хүсч байвал эхлээд уг
              бичлэгээ Youtube-д байршуулсан байх шаардлагатай.
            </p>
            <Button
              color="link"
              block
              onClick={() => {
                setVideo(null);
                setModal(false);
              }}
            >
              Back
            </Button>
          </ModalBody>
        </Modal>
      ) : null}
    </div>
  );
};
export default ProjectEdit;
