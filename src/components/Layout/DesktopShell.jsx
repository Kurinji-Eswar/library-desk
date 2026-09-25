import TopBar from './TopBar.jsx';
import Sidebar from './Sidebar.jsx';
import StatusFooter from './StatusFooter.jsx';
import ToastStack from '../UI/Toast.jsx';
import { ConfirmDialog } from '../UI/Modal.jsx';
import { useLibrary } from '../../context/LibraryContext.jsx';

import DesktopView from '../DesktopView.jsx';
import BooksView from '../Books/BooksView.jsx';
import MembersView from '../Members/MembersView.jsx';
import LoansView from '../Loans/LoansView.jsx';
import ReturnsView from '../Returns/ReturnsView.jsx';
import ReservationsView from '../Reservations/ReservationsView.jsx';
import CategoriesView from '../Categories/CategoriesView.jsx';
import ReportsView from '../Reports/ReportsView.jsx';
import SettingsView from '../Settings/SettingsView.jsx';

import BookFormModal from '../Books/BookFormModal.jsx';
import MemberFormModal from '../Members/MemberFormModal.jsx';
import NewLoanModal from '../Loans/NewLoanModal.jsx';
import NewReservationModal from '../Reservations/NewReservationModal.jsx';

function DesktopShell() {
  const { view, stats, modal, setModal, confirm, setConfirm, toasts, dismissToast } = useLibrary();

  return (
    <div className="min-h-screen paper-bg flex flex-col">
      <div className="fixed inset-0 grain pointer-events-none z-0"></div>

      <TopBar />

      <div className="flex-1 flex relative z-10" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <Sidebar />

        <main className="flex-1 min-w-0 p-3 sm:p-5">
          <div className="max-w-7xl mx-auto h-full">
            {view === 'desktop' && <DesktopView />}
            {view === 'books' && <BooksView />}
            {view === 'members' && <MembersView />}
            {view === 'loans' && <LoansView />}
            {view === 'returns' && <ReturnsView />}
            {view === 'reservations' && <ReservationsView />}
            {view === 'categories' && <CategoriesView />}
            {view === 'reports' && <ReportsView />}
            {view === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      <StatusFooter stats={stats} />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {modal?.type === 'addBook' && <BookFormModal onClose={() => setModal(null)} />}
      {modal?.type === 'editBook' && <BookFormModal book={modal.payload} onClose={() => setModal(null)} />}
      {modal?.type === 'addMember' && <MemberFormModal onClose={() => setModal(null)} />}
      {modal?.type === 'editMember' && <MemberFormModal member={modal.payload} onClose={() => setModal(null)} />}
      {modal?.type === 'newLoan' && <NewLoanModal preset={modal.payload} onClose={() => setModal(null)} />}
      {modal?.type === 'newReservation' && <NewReservationModal preset={modal.payload} onClose={() => setModal(null)} />}

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        body={confirm?.body}
        confirmLabel={confirm?.confirmLabel}
        danger={confirm?.danger}
        onConfirm={confirm?.onConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

export default DesktopShell;
