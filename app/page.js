import { redirect } from 'next/navigation';

function Home() {
  // Redirect users visiting the root URL to the auth page
  redirect('/auth');
}
export default Home;