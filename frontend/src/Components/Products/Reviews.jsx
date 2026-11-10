import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, IconButton, MenuItem, Rating, TextField, Tooltip } from "@mui/material";
import { FiEdit2, FiTrash2, FiMessageSquare } from "react-icons/fi";
import {
  createReview,
  deleteReviews,
  editReview,
  getProductReviews,
} from "../../Redux/Actions/reviewsActions";
import { formatDate } from "../../utils/format";
import { ListSkeleton } from "../common/Loaders";
import ConfirmDialog from "../common/ConfirmDialog";
import EmptyState from "../common/EmptyState";
import LoginPrompt from "./LoginPrompt";

const SORTS = [
  { value: "newest", label: "Най-нови" },
  { value: "oldest", label: "Най-стари" },
  { value: "best", label: "Най-висока оценка" },
  { value: "worst", label: "Най-ниска оценка" },
];
const sorters = {
  newest: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  oldest: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
  best: (a, b) => b.rating - a.rating,
  worst: (a, b) => a.rating - b.rating,
};

const ReviewItem = ({ review, canEdit }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(review.comment);
  const [rating, setRating] = useState(review.rating);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const save = async () => {
    if (!text.trim() || !rating) return;
    setSaving(true);
    const ok = await dispatch(editReview({ comment: text.trim(), rating }, review._id));
    setSaving(false);
    if (ok) setEditing(false);
  };

  const remove = async () => {
    setSaving(true);
    await dispatch(deleteReviews(review._id));
    setSaving(false);
    setConfirm(false);
  };

  const initials = (review.userName || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="review">
      <div className="review__head">
        <span className="avatar-initials" style={{ width: 40, height: 40, borderRadius: 12, fontSize: ".8rem" }}>
          {initials}
        </span>
        <div>
          <div className="review__name">{review.userName}</div>
          <div className="review__date">{formatDate(review.updatedAt)}</div>
        </div>
        {canEdit && !editing && (
          <div className="review__actions">
            <Tooltip title="Редактирай">
              <IconButton size="small" onClick={() => setEditing(true)} aria-label="Редактирай ревюто">
                <FiEdit2 />
              </IconButton>
            </Tooltip>
            <Tooltip title="Изтрий">
              <IconButton size="small" onClick={() => setConfirm(true)} aria-label="Изтрий ревюто">
                <FiTrash2 />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>

      {editing ? (
        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          <Rating value={rating} precision={0.5} onChange={(_, v) => setRating(v)} />
          <TextField multiline minRows={3} value={text} onChange={(e) => setText(e.target.value)} label="Вашето ревю" />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button color="inherit" onClick={() => { setEditing(false); setText(review.comment); setRating(review.rating); }}>
              Отказ
            </Button>
            <Button variant="contained" onClick={save} disabled={saving || !text.trim() || !rating}>
              Запази промените
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Rating value={review.rating} precision={0.5} readOnly size="small" sx={{ mt: 1.5 }} />
          <p className="review__text">{review.comment}</p>
        </>
      )}

      <ConfirmDialog
        open={confirm}
        danger
        loading={saving}
        title="Изтриване на ревю"
        text="Ревюто ще бъде премахнато окончателно."
        confirmLabel="Изтрий"
        onConfirm={remove}
        onClose={() => setConfirm(false)}
      />
    </article>
  );
};

const Reviews = ({ productId }) => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((s) => s.reviews);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [sort, setSort] = useState("newest");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    dispatch(getProductReviews(productId));
  }, [dispatch, productId]);

  const sorted = useMemo(() => [...reviews].sort(sorters[sort]), [reviews, sort]);
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length
    : 0;
  const alreadyReviewed = reviews.some((r) => String(r.userID) === String(user?._id));

  const submit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return setPrompt(true);
    setTouched(true);
    if (!rating || !comment.trim()) return;
    setSending(true);
    const ok = await dispatch(createReview({ comment: comment.trim(), rating, productId }));
    setSending(false);
    if (ok) {
      setComment("");
      setRating(0);
      setTouched(false);
    }
  };

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <aside className="review-summary">
        <h2 className="section-title" id="reviews-title" style={{ marginBottom: 14 }}>Ревюта</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="review-summary__score">{avg.toFixed(1)}</span>
          <div>
            <Rating value={avg} precision={0.5} readOnly />
            <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
              {reviews.length} {reviews.length === 1 ? "ревю" : "ревюта"}
            </div>
          </div>
        </div>

        {alreadyReviewed ? (
          <p className="summary__note" style={{ marginTop: 18 }}>
            Вече сте оставили ревю за този продукт. Можете да го редактирате от списъка.
          </p>
        ) : (
          <form className="review-form" onSubmit={submit} noValidate>
            <strong>Оценете продукта</strong>
            <Rating value={rating} precision={0.5} size="large" onChange={(_, v) => setRating(v || 0)} />
            {touched && !rating && (
              <span style={{ color: "var(--danger)", fontSize: ".85rem", marginTop: -6 }}>Изберете оценка.</span>
            )}
            <TextField
              multiline
              minRows={3}
              label="Вашето ревю"
              placeholder="Какво ви хареса и какво бихте подобрили?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              error={touched && !comment.trim()}
              helperText={touched && !comment.trim() ? "Напишете няколко думи за продукта." : " "}
            />
            <Button type="submit" variant="contained" disabled={sending}>
              {sending ? "Публикуване…" : "Публикувай ревю"}
            </Button>
          </form>
        )}
      </aside>

      <div>
        {reviews.length > 0 && (
          <div className="toolbar" style={{ marginBottom: 14 }}>
            <span className="toolbar__count">Какво казват клиентите</span>
            <TextField
              select
              size="small"
              label="Подреди по"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              fullWidth={false}
              sx={{ minWidth: 200 }}
            >
              {SORTS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>
          </div>
        )}
        {loading && reviews.length === 0 ? (
          <ListSkeleton rows={2} />
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={<FiMessageSquare />}
            title="Все още няма ревюта"
            text="Купили сте този продукт? Споделете впечатленията си като първи."
          />
        ) : (
          <div className="review-list">
            {sorted.map((r) => (
              <ReviewItem key={r._id} review={r} canEdit={String(r.userID) === String(user?._id)} />
            ))}
          </div>
        )}
      </div>

      <LoginPrompt
        open={prompt}
        onClose={() => setPrompt(false)}
        text="За да оставите ревю, трябва да влезете в профила си."
      />
    </section>
  );
};

export default Reviews;
