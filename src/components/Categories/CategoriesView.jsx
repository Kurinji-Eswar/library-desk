import { useState } from 'react';
import Window from '../Layout/Window.jsx';
import Button from '../UI/Button.jsx';
import Input from '../UI/Input.jsx';
import Icon from '../icons/Icon.jsx';
import { categoryColor } from '../../utils/libraryUtils.js';
import { useLibrary } from '../../context/LibraryContext.jsx';

function CategoriesView() {
  const { categories, books, addCategory, editCategory, deleteCategory, setConfirm } = useLibrary();
  const [newCat, setNewCat] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const countsFor = (name) => {
    const catBooks = books.filter((b) => b.category === name);
    return {
      total: catBooks.length,
      available: catBooks.filter((b) => b.availableCopies > 0).length,
      borrowed: catBooks.reduce((s, b) => s + (b.totalCopies - b.availableCopies), 0),
    };
  };

  return (
    <Window title="CATEGORIES / TAXONOMY" status={`${categories.length} TOTAL`}>
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="NEW CATEGORY NAME" className="flex-1" />
        <Button
          variant="primary"
          onClick={() => {
            addCategory(newCat);
            setNewCat('');
          }}
        >
          <Icon name="plus" className="w-3.5 h-3.5" />
          ADD CATEGORY
        </Button>
      </div>

      <div className="noscroll-x">
        <table className="w-full text-sm border-collapse min-w-[560px]">
          <thead>
            <tr className="border-b-2 border-ink text-left">
              {['CATEGORY', 'BOOK COUNT', 'AVAILABLE', 'BORROWED', ''].map((h) => (
                <th key={h} className="py-2 px-2 text-[10px] font-mono font-bold uppercase tracking-widest text-grayish">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const counts = countsFor(c.name);
              const isEditing = editingId === c.id;
              return (
                <tr key={c.id} className="border-b border-ink/10">
                  <td className="py-2 px-2 font-medium">
                    {isEditing ? (
                      <div className="flex gap-1.5">
                        <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="!py-1" />
                        <Button
                          className="!px-2 !py-1"
                          onClick={() => {
                            editCategory(c.id, editValue);
                            setEditingId(null);
                          }}
                        >
                          <Icon name="check" className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 border border-ink" style={{ background: categoryColor(c.name) }}></span>
                        {c.name}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 font-mono text-xs">{counts.total}</td>
                  <td className="py-2 px-2 font-mono text-xs">{counts.available}</td>
                  <td className="py-2 px-2 font-mono text-xs">{counts.borrowed}</td>
                  <td className="py-2 px-2 flex gap-1.5">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditValue(c.name);
                      }}
                      className="focus-ring text-blue"
                      aria-label={`Edit ${c.name}`}
                    >
                      <Icon name="edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirm({
                          title: 'DELETE CATEGORY',
                          body: `Delete "${c.name}"? Books must be reassigned first if any are using it.`,
                          confirmLabel: 'DELETE',
                          danger: true,
                          onConfirm: () => {
                            deleteCategory(c.id);
                            setConfirm(null);
                          },
                        })
                      }
                      className="focus-ring text-amber"
                      aria-label={`Delete ${c.name}`}
                    >
                      <Icon name="trash" className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Window>
  );
}

export default CategoriesView;
