import BookCover from './BookCover.jsx';
import Badge from '../UI/Badge.jsx';
import Icon from '../icons/Icon.jsx';

const COLUMNS = ['', 'ID', 'TITLE', 'AUTHOR', 'CATEGORY', 'YEAR', 'COPIES', 'AVAIL.', 'STATUS', ''];

function BookTable({ books, onSelect }) {
  return (
    <div className="noscroll-x">
      <table className="w-full text-sm border-collapse min-w-[820px]">
        <thead>
          <tr className="border-b-2 border-ink text-left">
            {COLUMNS.map((h, i) => (
              <th key={`${h}-${i}`} className="py-2 px-2 text-[10px] font-mono font-bold uppercase tracking-widest text-grayish">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id} className="border-b border-ink/10 hover:bg-creamSoft/60 cursor-pointer" onClick={() => onSelect(b.id)}>
              <td className="py-2 px-2">
                <BookCover title={b.title} author={b.author} category={b.category} size="sm" />
              </td>
              <td className="py-2 px-2 font-mono text-xs text-grayish">{b.id}</td>
              <td className="py-2 px-2 font-medium max-w-[180px] truncate">{b.title}</td>
              <td className="py-2 px-2 text-grayish max-w-[140px] truncate">{b.author}</td>
              <td className="py-2 px-2">
                <Badge>{b.category}</Badge>
              </td>
              <td className="py-2 px-2 font-mono text-xs">{b.year}</td>
              <td className="py-2 px-2 font-mono text-xs">{b.totalCopies}</td>
              <td className="py-2 px-2 font-mono text-xs">{b.availableCopies}</td>
              <td className="py-2 px-2">
                <Badge tone={b.availableCopies > 0 ? 'mint' : 'amber'}>{b.availableCopies > 0 ? 'AVAILABLE' : 'ALL OUT'}</Badge>
              </td>
              <td className="py-2 px-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(b.id);
                  }}
                  className="focus-ring text-blue"
                  aria-label={`Open ${b.title}`}
                >
                  <Icon name="chevronRight" className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookTable;
