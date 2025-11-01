import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ForumThread from '@/components/forums/ForumThread';
import { generateSEOMetadata } from '@/lib/seo';

interface PageProps {
  params: {
    threadId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // TODO: Fetch thread data for metadata
  return generateSEOMetadata({
    title: `Forum Discussion | Autoilty.com`,
    description: 'Join the automotive community discussion',
    url: `/forums/${params.threadId}`,
  });
}

async function getThread(threadId: string) {
  // TODO: Fetch from Supabase or API
  // For now, return mock data
  return {
    id: threadId,
    title: 'Best mechanics in Singapore?',
    content: 'Looking for reliable mechanics in Singapore. Any recommendations?',
    author: {
      id: 'user-1',
      name: 'Auto Enthusiast',
    },
    category: 'General Discussion',
    countryCode: 'SG',
    createdAt: new Date().toISOString(),
    views: 1234,
    likes: 45,
    replies: 12,
    posts: [],
    tags: ['mechanics', 'singapore', 'recommendations'],
  };
}

export default async function ForumThreadPage({ params }: PageProps) {
  const thread = await getThread(params.threadId);

  if (!thread) {
    notFound();
  }

  return <ForumThread thread={thread} countryCode={thread.countryCode} />;
}

