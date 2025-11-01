import { redirect } from 'next/navigation';

// Redirect /sg to /sg (country route)
// This is handled by the [country] dynamic route, but keeping for explicit access
export default function SGHomePage() {
  redirect('/sg');
}

