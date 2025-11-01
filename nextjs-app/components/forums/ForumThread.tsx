'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { FiMessageCircle, FiEye, FiThumbsUp, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { getCountryConfig } from '@/lib/config/countries';

export interface ForumPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: ForumPost[];
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  countryCode: string;
  createdAt: string;
  views: number;
  likes: number;
  replies: number;
  posts: ForumPost[];
  tags?: string[];
}

interface ForumThreadProps {
  thread: ForumThread;
  countryCode: string;
}

export default function ForumThread({ thread, countryCode }: ForumThreadProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [localPosts, setLocalPosts] = useState<ForumPost[]>(thread.posts || []);
  const config = getCountryConfig(countryCode);

  // Country-specific placeholders
  const placeholders: Record<string, string> = {
    CA: 'Share your experience or ask a question...',
    SG: 'Ask about COE, car reviews, or modifications...',
    MY: 'Discuss Proton, Perodua, or Malaysian car culture...',
    ID: 'Share flood-proof mods, car reviews, or maintenance tips...',
    TH: 'Discuss car reviews, first car program, or Thai car culture...',
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    if (!newPostContent.trim()) return;

    setIsPosting(true);

    // Mock post - replace with actual API call
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: {
        id: session.user?.id || 'user-1',
        name: session.user?.name || 'Anonymous',
        avatar: session.user?.image || undefined,
      },
      content: newPostContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    // Optimistic update
    setLocalPosts([...localPosts, newPost]);
    setNewPostContent('');
    setIsPosting(false);

    // TODO: Integrate with Supabase
    // await supabase.from('forum_posts').insert({
    //   thread_id: thread.id,
    //   author_id: session.user.id,
    //   content: newPostContent,
    // });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Thread Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{thread.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <FiUser className="w-4 h-4" />
                <span>{thread.author.name}</span>
              </div>
              <span>•</span>
              <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <FiEye className="w-4 h-4" />
                <span>{thread.views} {t('forum.views')}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <FiMessageCircle className="w-4 h-4" />
                <span>{thread.replies} {t('forum.replies')}</span>
              </div>
            </div>
          </div>
          <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
            {config.forumCategories.find((c) => c === thread.category) || thread.category}
          </span>
        </div>

        {/* Original Post Content */}
        <div className="prose max-w-none mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">{thread.content}</p>
        </div>

        {/* Tags */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {thread.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Replies Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {localPosts.length} {localPosts.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        <div className="space-y-4">
          {localPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{post.author.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                      <FiThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {session ? (
          <form onSubmit={handlePost} className="space-y-4">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={placeholders[countryCode] || placeholders.CA}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPosting || !newPostContent.trim()}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isPosting ? 'Posting...' : t('forum.post')}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Please log in to post a reply
            </p>
            <Link
              href="/login"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold inline-block"
            >
              {t('nav.login')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

