import React, { useEffect, useState } from "react";

function Commandes(props) {
  const [change, setChange] = useState(false);
  const [comments, setComments] = useState();
  const [userComment, setUserComment] = useState();

  useEffect(() => {
    console.log();
    fetch("https://127.0.0.1:8000/commentaire/" + props.product_id, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(
          data.map((e, i) => {
            let date = new Date(e.comment.date).toLocaleDateString();
            return (
              <div key={i}>
                <p>
                  <b>{e.email}</b>
                  <p>{e.comment.commentaire}</p>
                  <p>{date}</p>
                </p>
              </div>
            );
          })
        );
      });
    return () => {
      setComments();
    };
  }, [change]);

  return (
    <div
      className="Commentaire"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        border: "1px solid black",
      }}
    >
      <h3>Comments</h3>
      <form>
        <input
          type="text"
          name="comment"
          id="comment"
          value={userComment}
          onChange={(e) => {
            setUserComment(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={async () => {
            let form = new FormData();
            form.append("id_produit", props.product_id);
            form.append("comment", userComment);
            fetch("https://127.0.0.1:8000/commentaire/new", {
              method: "POST",
              headers: {
                Authorization: document.cookie.substring(
                  document.cookie.indexOf("/^") + 2,
                  document.cookie.indexOf("$/")
                ),
              },
              body: form,
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                setUserComment("");
                if (change) {
                  setChange(false);
                } else {
                  setChange(true);
                }
              });
          }}
        >
          Send
        </button>
      </form>
      {comments}
    </div>
  );
}

export default Commandes;
