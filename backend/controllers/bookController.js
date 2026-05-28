let books = [
  { id: 1, title: 'The Obsidian Siren' }
];

const getBooks = (req, res) => {
  res.json(books);
};

const createBook = (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newBook = {
    id: Date.now(),
    title
  };

  books.push(newBook);
  res.status(201).json(newBook);
};

module.exports = {
  getBooks,
  createBook
};