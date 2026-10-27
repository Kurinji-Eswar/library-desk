import { useState } from 'react';
import Window from '../Layout/Window.jsx';
import Button from '../UI/Button.jsx';
import StatBlock from '../UI/StatBlock.jsx';
import Icon from '../icons/Icon.jsx';
import { SCHEMA_VERSION } from '../../utils/libraryUtils.js';
import { useLibrary } from '../../context/LibraryContext.jsx';

function SettingsView() {
  const {
    setConfirm,
    resetDemoData,
    exportData,
    books,
    members,
    loans,
    reservations,
    backendConnected,
    migrateLocalDataToBackend,
    refreshFromBackend,
  } = useLibrary();

  const [migrating, setMigrating] = useState(false);

  const handleMigration = async () => {
    setMigrating(true);
    try {
      await migrateLocalDataToBackend();
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Window
        title="SYSTEM / SETTINGS"
        status={backendConnected ? 'SPRING BOOT + POSTGRESQL' : 'LOCAL CACHE MODE'}
        className="h-auto"
      >
        <div className="grid sm:grid-cols-4 gap-2 mb-5">
          <StatBlock label="Backend Status" value={backendConnected ? 'ONLINE' : 'OFFLINE'} />
          <StatBlock label="Primary Database" value={backendConnected ? 'PostgreSQL' : 'localStorage'} />
          <StatBlock label="Flyway Schema" value="v2 (Clean)" />
          <StatBlock label="Active Records" value={books.length + members.length + loans.length + reservations.length} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="border-2 border-ink p-4 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest mb-1">Export Data</div>
              <p className="text-sm text-grayish mb-3">Download all books, members, loans, reservations, and categories as a JSON backup.</p>
            </div>
            <Button onClick={exportData} className="w-full">
              <Icon name="download" className="w-3.5 h-3.5" />
              EXPORT JSON
            </Button>
          </div>

          <div className="border-2 border-ink p-4 flex flex-col justify-between bg-mint/10">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest mb-1 text-ink">Migrate to Database</div>
              <p className="text-sm text-grayish mb-3">Import browser localStorage records into the PostgreSQL relational database.</p>
            </div>
            <Button
              variant="primary"
              disabled={!backendConnected || migrating}
              onClick={handleMigration}
              className="w-full"
            >
              <Icon name="monitor" className="w-3.5 h-3.5" />
              {migrating ? 'MIGRATING...' : 'MIGRATE TO POSTGRES'}
            </Button>
          </div>

          <div className="border-2 border-ink p-4 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest mb-1">Reset Preview</div>
              <p className="text-sm text-grayish mb-3">Restore default seed records and re-sync workstation with the server.</p>
            </div>
            <Button
              variant="danger"
              onClick={() =>
                setConfirm({
                  title: 'RESET DATASET',
                  body: 'This will reset demo data and re-sync with the database. Continue?',
                  confirmLabel: 'RESET PREVIEW',
                  danger: true,
                  onConfirm: () => {
                    resetDemoData();
                    refreshFromBackend();
                  },
                })
              }
              className="w-full"
            >
              <Icon name="power" className="w-3.5 h-3.5" />
              RESET PREVIEW
            </Button>
          </div>
        </div>
      </Window>

      <Window title="ABOUT & SYSTEM ARCHITECTURE" className="h-auto">
        <div className="font-mono text-xs uppercase tracking-widest text-grayish space-y-2">
          <div className="text-ink font-bold text-sm">LIBRARY / DESK — Full-Stack Enhanced Edition</div>
          <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-ink/20">
            <div>• FRONTEND: React 18, Vite 5, Tailwind CSS Neo-Brutalist UI</div>
            <div>• BACKEND: Java 21, Spring Boot 3.3.5 REST API</div>
            <div>• PERSISTENCE: Spring Data JPA, PostgreSQL 18, HikariCP</div>
            <div>• MIGRATIONS: Flyway Versioned Migrations (V1, V2)</div>
            <div>• CONCURRENCY: Optimistic Locking (@Version) & ACID Transactions</div>
            <div>• DOCUMENTATION: OpenAPI 3.0 / Swagger UI at /swagger-ui.html</div>
          </div>
          <div className="pt-2 text-[11px] text-grayish">
            Complies with academic course outcomes CO-1 (UI Layout), CO-2 (React State/Hooks), CO-3 (Relational DB & SQL), CO-4 (Spring Boot Layered Architecture), and CO-5 (JPA Persistence & Integrated REST API).
          </div>
        </div>
      </Window>
    </div>
  );
}

export default SettingsView;
