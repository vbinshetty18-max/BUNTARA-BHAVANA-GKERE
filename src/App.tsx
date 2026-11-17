import AdminApp from './AdminApp';
import BuntaraApp from './BuntaraApp';

export default function App() {
  return window.location.pathname.replace(/\/+$/, '') === '/admin'
    ? <AdminApp />
    : <BuntaraApp />;
}
