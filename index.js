import { Byte, cors, send } from '@bit-js/byte';
import { join } from 'path';
const htmlPath = join(process.cwd(), 'static', 'index.html');
import mongoose from 'mongoose';
import Blog from './models/Blog';

const app = new Byte();
app.use(cors({ allowOrigin: 'http://localhost:5173' }));

const dbURI = Bun.env.MONGO_URI;

mongoose
  .connect(dbURI)
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error(err));

app.get('/', send.html(Bun.file(htmlPath)));

app.post('/create', async (ctx) => {
  try {
    const data = await ctx.req.json();
    const { title, subtitles } = data;

    const slug = title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    const formattedSubtitles = subtitles.map((subtitle) => ({
      title: subtitle.title,
      paragraphs: subtitle.paragraphs.map((paragraph) => ({ text: paragraph })),
    }));

    const newBlog = new Blog({ title, slug, subtitles: formattedSubtitles });

    await newBlog.save();

    return ctx.json({ message: 'Blog saved successfully!' });
  } catch (error) {
    console.error('Error saving blog:', error.message);
    return ctx.json({ message: 'Error saving blog.', error: error.message });
  }
});

app.get('/getBlogs', async (ctx) => {
  try {
    const blogs = await Blog.find();
    return ctx.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    return ctx.json({ message: 'Error fetching blogs.', error: error.message });
  }
});

app.get('/blog/:slug', async (ctx) => {
  try {
    const slug = ctx.params.slug;
    const blog = await Blog.findOne({ slug: slug });
    if (!blog) {
      return ctx.json({ message: 'Blog not found' });
    }
    return ctx.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error.message);
    return ctx.json({ message: 'Error fetching blog.', error: error.message });
  }
});

export default app;
