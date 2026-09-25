import { LibraryProvider } from './context/LibraryContext.jsx';
import DesktopShell from './components/Layout/DesktopShell.jsx';

function App() {
  return (
    <LibraryProvider>
      <DesktopShell />
    </LibraryProvider>
  );
}

export default App;
