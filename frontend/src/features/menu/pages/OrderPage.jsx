import { useState } from "react";

const OrderPage = () => {
  const [form, setForm] = useState({ name: "", email: "", qty: 1 });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const validate = (values) => {
    const nextErrors = {};
    if (values.name.trim().length < 2) nextErrors.name = "Please enter your name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) nextErrors.email = "Enter a valid email";
    if (Number(values.qty) < 1) nextErrors.qty = "At least one item is required";
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) setDone(true);
  };

  if (done) return (
    <div className="success-card">
      <span className="success-icon">✓</span>
      <p className="eyebrow">Order received</p>
      <h1>Thanks, {form.name}!</h1>
      <p>We&apos;ll send your order confirmation to <strong>{form.email}</strong>.</p>
      <a className="button" href="/">Back to menu</a>
    </div>
  );

  return (
    <div className="order-layout">
      <div className="order-intro">
        <p className="eyebrow">Quick and easy</p>
        <h1>Let&apos;s get<br /><em>you fed.</em></h1>
        <p>Tell us where to send your order and we&apos;ll take care of the rest.</p>
        <div className="order-perks"><span>✦ Freshly prepared</span><span>✦ Easy campus pickup</span></div>
      </div>
      <form className="order-form" onSubmit={handleSubmit} noValidate>
        <div className="form-heading"><span className="form-step">01</span><div><h2>Your details</h2><p>We&apos;ll use these to confirm your order.</p></div></div>
        <label>Full name<input name="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Alex Perera" />{errors.name && <span className="field-error">{errors.name}</span>}</label>
        <label>Email address<input name="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@campus.edu" />{errors.email && <span className="field-error">{errors.email}</span>}</label>
        <label>How many meals?<input name="qty" type="number" min="1" value={form.qty} onChange={(event) => setForm({ ...form, qty: event.target.value })} />{errors.qty && <span className="field-error">{errors.qty}</span>}</label>
        <button className="button submit-button" type="submit">Place order <span>↗</span></button>
        <p className="form-note">No payment required now · Pay at the counter</p>
      </form>
    </div>
  );
};

export default OrderPage;
