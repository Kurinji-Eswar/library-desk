import Window from '../Layout/Window.jsx';
import Button from '../UI/Button.jsx';
import StatBlock from '../UI/StatBlock.jsx';
import Icon from '../icons/Icon.jsx';
import { SCHEMA_VERSION } from '../../utils/libraryUtils.js';
import { useLibrary } from '../../context/LibraryContext.jsx';

function SettingsView() {
  const { setConfirm, resetDemoData, exportData, books, members, loans, reservations } = useLibrary();

  return (
    <div className="space-y-4">
      <Window title="SYSTEM / SETTINGS" status="LOCAL MODE">
        <div className="grid sm:grid-cols-3 gap-2 mb-5">
          <StatBlock label="Schema Version" value={SCHEMA_VERSION} />
          <StatBlock label="Storage" value="localStorage" />
          <StatBlock label="Records" value={books.length + members.length + loans.length + reservations.length} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border-2 border-ink p-4">
            <div className="font-mono text-xs font-bold uppercase tracking-widest mb-1">Export Data</div>
            <p className="text-sm text-grayish mb-3">Download all books, members, loans, reservations and categories as one JSON file.</p>
            <Button onClick={exportData}>
              <Icon name="download" className="w-3.5 h-3.5" />
              EXPORT DATA
            </Button>
          </div>
          <div className="border-2 border-ink p-4">
            <div className="font-mono text-xs font-bold uppercase tracking-widest mb-1">Reset Demo Data</div>
            <p className="text-sm text-grayish mb-3">Clear all local data and restore the original demo dataset. This cannot be undone.</p>
            <Button
              variant="danger"
              onClick={() =>
                setConfirm({
                  title: 'RESET DEMO DATA',
                  body: 'This will erase all current data and restore the original demo dataset. Continue?',
                  confirmLabel: 'RESET DATA',
                  danger: true,
                  onConfirm: resetDemoData,
                })
              }
            >
              <Icon name="power" className="w-3.5 h-3.5" />
              RESET DEMO DATA
            </Button>
          </div>
        </div>
      </Window>

      <Window title="ABOUT">
        <div className="font-mono text-xs uppercase tracking-widest text-grayish space-y-1">
          <div>LIBRARY OS v1.0</div>
          <div>FRONTEND-ONLY APPLICATION</div>
          <div>NO SERVER · NO DATABASE · NO EXTERNAL API</div>
          <div>ALL DATA STORED LOCALLY IN YOUR BROWSER</div>
        </div>
      </Window>
    </div>
  );
}

export default SettingsView;
