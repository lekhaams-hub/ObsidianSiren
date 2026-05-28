let drafts = [];

const getDrafts = (req, res) => {
  res.json(drafts);
};

const saveDraft = (req, res) => {
  const { bookId, content } = req.body;

  if (!bookId || content === undefined) {
    return res.status(400).json({ message: 'bookId and content are required' });
  }

  const existingDraftIndex = drafts.findIndex(d => d.bookId === bookId);

  const draftData = {
    bookId,
    content,
    updatedAt: new Date().toISOString()
  };

  if (existingDraftIndex >= 0) {
    drafts[existingDraftIndex] = draftData;
  } else {
    drafts.push(draftData);
  }

  res.json(draftData);
};

module.exports = {
  getDrafts,
  saveDraft
};