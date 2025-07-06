import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { PageProps } from '@inertiajs/inertia';
import { type BreadcrumbItem } from '@/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);



type Post = {
  id: number;
  content: string;
  audience_type: string;
  audience_value: string;
  post_type: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
};

type PostsPagination = {
  data: Post[];
  next_page_url: string | null;
};

interface DashboardPageProps extends PageProps {
  posts: PostsPagination;
}
const formatTimeAgo = (timestamp: string) => {
  return dayjs(timestamp).fromNow(); // زي: منذ دقيقة، منذ ساعتين
};

export default function Dashboard() {
    const { posts: initialPosts } = usePage<DashboardPageProps>().props;

    const [posts, setPosts] = useState<Post[]>(initialPosts.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(initialPosts.next_page_url);

  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    audience_type: '',
    audience_value: '',
    post_type: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/posts', formData);
      toast.success('Post published');
      setFormData({ content: '', audience_type: '', audience_value: '' , post_type: ''});
      window.location.reload();
    } catch (err) {
      toast.error('Failed to publish post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMore = async () => {
    if (!nextPageUrl) return;
    try {
      const res = await axios.get(nextPageUrl);
      setPosts([...posts, ...res.data.data]);
      setNextPageUrl(res.data.next_page_url);
    } catch {
      toast.error('Failed to load more posts');
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
      {
          title: 'News Feed',
          href: '/posts',
      },
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Home Feed" />
      <Toaster position="top-right" />

      <div className="w-full mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition"
          >
            <Plus size={18} /> New Post
          </button>
        </div>

        {/* Post Form */}
        {showPostForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-md p-4 space-y-4"
          >
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="What's on your mind?"
              rows={3}
              required
              className="w-full p-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={formData.post_type}
                onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
                className="w-full sm:w-1/3 px-3 py-2 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md"
              >
                <option value="">Type</option>
                <option value="Outage">Outage</option>
                <option value="Braks">Braks</option>
                <option value="annuncement">annuncement</option>
              </select>
              <select
                value={formData.audience_type}
                onChange={(e) => setFormData({ ...formData, audience_type: e.target.value })}
                className="w-full sm:w-1/3 px-3 py-2 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md"
              >
                <option value="">Audience</option>
                <option value="site">Site</option>
                <option value="department">Department</option>
                <option value="team">Team</option>
              </select>

              <input
                type="text"
                value={formData.audience_value}
                onChange={(e) => setFormData({ ...formData, audience_value: e.target.value })}
                placeholder="Target (e.g. Site A)"
                required
                className="w-full px-3 py-2 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        )}

        {/* Posts */}
        <div className="space-y-4">
         {!posts || posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">No posts yet.</p>
        ) : (
        posts.map((post) => (
            <div
            key={post.id}
            className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-4 shadow-md space-y-2"
            >
            {/* Title - post_type */}
            <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {post.post_type || 'Untitled'}
            </h2>

            {/* Content */}
            <p className="text-gray-800 dark:text-gray-100">{post.content}</p>

            {/* Meta info */}
            <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center pt-2 border-t dark:border-gray-700">
                {post.user && (
                    <div className="text-xs text-right text-gray-500 dark:text-gray-400 italic">
                    By: {post.user.name}
                    </div>
                )}
                <span>
                🎯 {post.audience_type} - {post.audience_value}
                </span>
                <span>
                🕒 {formatTimeAgo(post.created_at)}
                </span>
            </div>


            </div>
        ))
        )}


          {nextPageUrl && (
            <div className="text-center">
              <button
                onClick={loadMore}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Load more posts
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
