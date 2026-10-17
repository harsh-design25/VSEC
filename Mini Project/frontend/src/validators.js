// Client-side validation (the server validates again).
export function validateBook(f) {
  const e = {};
  const title = f.title.trim();
  const author = f.author.trim();
  const isbn = f.isbn.replace(/[-\s]/g, '');
  const category = f.category.trim();
  const copies = Number(f.totalCopies);

  if (title.length < 2 || title.length > 150) e.title = 'Title must be 2-150 characters';
  if (!/^[A-Za-z][A-Za-z .,'-]{1,99}$/.test(author)) e.author = 'Author: letters and spaces only (2-100 chars)';
  if (!/^(\d{10}|\d{13})$/.test(isbn)) e.isbn = 'ISBN must be 10 or 13 digits';
  if (category.length < 2 || category.length > 50) e.category = 'Category must be 2-50 characters';
  if (!Number.isInteger(copies) || copies < 1 || copies > 1000) e.totalCopies = 'Copies must be a whole number (1-1000)';
  return e;
}

export function validateMember(f) {
  const e = {};
  if (!/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(f.name.trim())) e.name = 'Name: letters and spaces only (2-60 chars)';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address';
  if (!/^[6-9]\d{9}$/.test(f.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number';
  return e;
}
