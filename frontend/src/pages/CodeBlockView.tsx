import React, { useState } from 'react';
import { useCodeBlocks } from '../context/CodeBlockContext';
import { CustomIcon } from '../utils/iconMapping';
import { Filter, ArrowUpDown, Grid, List, PlusCircle, Code } from 'lucide-react';
import CodeBlockGrid from '../components/codeblock/CodeBlockGrid';
import { CodeBlock as CodeBlockType } from '../types';
import AddCodeBlockModal from '../components/ui/AddCodeBlockModal';

const CodeBlockView: React.FC = () => {
  const {
    activeCollection,
    filteredCodeBlocks,
    collections,
    setActiveCollection,
    toggleFavorite,
    deleteCodeBlock,
    openModal,
    isModalOpen,
    closeModal,
    addCodeBlock,
    updateCodeBlock,
    searchTerm,
  } = useCodeBlocks();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingCodeBlock, setEditingCodeBlock] = useState<CodeBlockType | null>(null);

  // Get current collection data
  const currentCollection = collections.find(c => c.name === activeCollection);
  const icon = 'code';
  const name = activeCollection || 'All Code Blocks';
  const count = currentCollection?.count || 0;

  const handleEditCodeBlock = (codeBlock: CodeBlockType) => {
    setEditingCodeBlock(codeBlock);
    openModal();
  };

  const handleSaveCodeBlock = (codeBlockData: Omit<CodeBlockType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCodeBlock) {
      updateCodeBlock(editingCodeBlock.id, codeBlockData);
    } else {
      addCodeBlock(codeBlockData);
    }
    setEditingCodeBlock(null);
  };

  const handleCloseModal = () => {
    setEditingCodeBlock(null);
    closeModal();
  };

  const finalItemsToDisplay = filteredCodeBlocks;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Page Title Section */}
      <section className="px-6 pt-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <CustomIcon icon={icon} size={24} className="text-white" />
              {name}
            </h2>
            <p className="text-sm text-white/70">
              {count} code blocks found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-black/20 hover:bg-black/30 border border-white/10 rounded-md text-sm text-white/90 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-black/20 hover:bg-black/30 border border-white/10 rounded-md text-sm text-white/90 transition-colors">
              <ArrowUpDown size={16} /> Sort
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 border border-white/10 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-black/20 hover:bg-black/30 text-white/90'
              }`} 
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 border border-white/10 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-black/20 hover:bg-black/30 text-white/90'
              }`} 
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Code Blocks Grid Section */}
      <section className="px-6 pb-6 flex-1 flex flex-col">
        {finalItemsToDisplay.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <PlusCircle size={48} className="mx-auto text-white/30 mb-4" />
            <h3 className="text-xl font-semibold text-white/80 mb-2">
              {searchTerm
                ? 'No Code Blocks Match Your Search'
                : 'This Collection is Empty'}
            </h3>
            <p className="text-white/50 mb-6 max-w-md">
              {searchTerm
                ? `Try refining your search term or clearing it to see all code blocks in "${name}".`
                : `Add some code blocks to "${name}" to see them here.`}
            </p>
            {!searchTerm && (
              <button
                onClick={openModal}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg flex items-center mx-auto text-sm transition-colors"
              >
                <Code size={18} className="mr-2" /> Add Code Block to "{name}"
              </button>
            )}
          </div>
        ) : (
          <CodeBlockGrid
            codeBlocks={finalItemsToDisplay}
            onToggleFavorite={toggleFavorite}
            onEdit={handleEditCodeBlock}
            onDelete={deleteCodeBlock}
            viewMode={viewMode}
          />
        )}
      </section>

      {/* Add/Edit Code Block Modal */}
      <AddCodeBlockModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCodeBlock}
        editingCodeBlock={editingCodeBlock}
        collections={collections}
      />
    </div>
  );
};

export default CodeBlockView;
