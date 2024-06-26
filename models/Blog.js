import mongoose from 'mongoose';

const paragraphSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const subtitleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  paragraphs: [paragraphSchema],
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  subtitles: [subtitleSchema], // Corrected the field name to match your requirement
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
