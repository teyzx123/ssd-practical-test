// Frontend check - same OWASP C7 Level 1 rules as the backend.
// Backend re-validates everything; this is only for fast user feedback.
const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

function checkPolicy(password) {
  if (!password) return 'Password is required.';
  if (password.length < MIN_LENGTH) return `Password must be at least ${MIN_LENGTH} characters.`;
  if (password.length > MAX_LENGTH) return `Password must not exceed ${MAX_LENGTH} characters.`;
  return null;
}

document.addEventListener('submit', e => {
  const password = e.target.querySelector('input[name="password"]')?.value;
  const error = checkPolicy(password);
  if (error) {
    e.preventDefault();
    document.getElementById('error').textContent = error;
  }
});
