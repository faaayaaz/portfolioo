export function validateContact(input, now = Date.now()) {
  if (!input || typeof input !== "object")
    return { error: "A message is required." };
  if (typeof input.website === "string" && input.website) return { spam: true };
  if (
    !Number.isFinite(input.startedAt) ||
    now - input.startedAt < 1500 ||
    now - input.startedAt > 86400000
  )
    return {
      error: "Please take a moment to review your message, then try again.",
    };
  const { name, email, message } = input;
  if (typeof name !== "string" || name.trim().length < 2 || name.length > 100)
    return { error: "Please enter a name between 2 and 100 characters." };
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^\S+@[^\s@]+\.[^\s@]+$/.test(email) ||
    /[\r\n]/.test(email)
  )
    return { error: "Please enter a valid email address." };
  if (
    typeof message !== "string" ||
    message.trim().length < 20 ||
    message.length > 5000
  )
    return { error: "Please write a message between 20 and 5,000 characters." };
  return {
    data: { name: name.trim(), email: email.trim(), message: message.trim() },
  };
}
