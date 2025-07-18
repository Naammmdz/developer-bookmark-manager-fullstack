import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Code, Tag, FileText, Globe, Lock, Heart } from 'lucide-react';
import { CodeBlock as CodeBlockType } from '../../types';
import { useBookmarks } from '../../context/BookmarkContext';
import NeonButton from './NeonButton';

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { 
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: { 
      duration: 0.2,
      ease: "easeIn" 
    }
  }
};

interface AddCodeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (codeBlock: Omit<CodeBlockType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingCodeBlock?: CodeBlockType | null;
  collections?: { name: string; count: number }[];
}

const AddCodeBlockModal: React.FC<AddCodeBlockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCodeBlock = null,
  collections = []
}) => {
  // Get bookmark collections and active collection
  const { collections: bookmarkCollections, activeCollection, collectionData } = useBookmarks();
  
  // Get the current collection name based on activeCollection
  const getCurrentCollectionName = () => {
    if (activeCollection === 'all' || activeCollection === 'favorites' || activeCollection === 'recently_added') {
      // For special collections, default to first regular collection or 'Uncategorized'
      return bookmarkCollections.length > 0 ? bookmarkCollections[0].name : 'Uncategorized';
    }
    // For regular collections, find the collection name
    const currentCollection = collectionData?.[activeCollection];
    return currentCollection?.name || (bookmarkCollections.length > 0 ? bookmarkCollections[0].name : 'Uncategorized');
  };
  
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>(['']);
  const [collection, setCollection] = useState('Uncategorized'); // Will be updated by useEffect
  const [isPublic, setIsPublic] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCodeField, setShowCodeField] = useState(false);

  // Programming languages list
  const languages = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'css', 'html',
    'sql', 'bash', 'shell', 'json', 'xml', 'yaml', 'dockerfile', 'go', 'rust',
    'php', 'ruby', 'swift', 'kotlin', 'dart', 'scala', 'perl', 'r', 'matlab',
    'lua', 'haskell', 'clojure', 'elixir', 'elm', 'vue', 'react', 'angular',
    'svelte', 'sass', 'scss', 'less', 'stylus', 'graphql', 'powershell',
    'batch', 'makefile', 'cmake', 'nginx', 'apache', 'terraform', 'ansible',
    'puppet', 'chef', 'vagrant', 'jenkins', 'azure', 'aws', 'gcp', 'kubernetes',
    'docker', 'mongodb', 'redis', 'elasticsearch', 'solr', 'cassandra',
    'postgres', 'mysql', 'sqlite', 'mariadb', 'oracle', 'mssql', 'text', 'plain'
  ];

  // Update collection when collections load or activeCollection changes
  useEffect(() => {
    const newCollection = getCurrentCollectionName();
    setCollection(newCollection);
  }, [bookmarkCollections, activeCollection, collectionData]);
  
  // Reset form when modal opens/closes or when editing different code block
  useEffect(() => {
    if (isOpen) {
      if (editingCodeBlock) {
        setTitle(editingCodeBlock.title);
        setLanguage(editingCodeBlock.language);
        setCode(editingCodeBlock.code);
        setDescription(editingCodeBlock.description || '');
        setTags(editingCodeBlock.tags.length > 0 ? editingCodeBlock.tags : ['']);
        setCollection(editingCodeBlock.collection);
        setIsPublic(editingCodeBlock.isPublic);
        setIsFavorite(editingCodeBlock.isFavorite);
        setShowCodeField(true); // Show code field when editing
      } else {
        setTitle('');
        setLanguage('javascript');
        setCode('');
        setDescription('');
        setTags(['']);
        setCollection(getCurrentCollectionName());
        setIsPublic(true);
        setIsFavorite(false);
        setShowCodeField(false); // Hide code field when adding new
      }
    }
  }, [isOpen, editingCodeBlock]);
  
  // Tag management
  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };
  
  const addTagField = () => {
    setTags([...tags, '']);
  };
  
  const removeTagField = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags.length ? newTags : ['']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !code.trim()) {
      alert('Please provide both title and code.');
      return;
    }

    // Filter empty tags
    const filteredTags = tags.filter(tag => tag.trim() !== '');

    const codeBlockData = {
      title: title.trim(),
      language: language.toLowerCase(),
      code: code.trim(),
      description: description.trim() || undefined,
      tags: filteredTags,
      collection: collection,
      isPublic: isPublic,
      isFavorite: isFavorite,
    };

    onSave(codeBlockData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-background-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Code className="text-primary" size={20} />
                {editingCodeBlock ? 'Edit Code Block' : 'Add Code Block'}
              </h2>
              <button 
                onClick={handleClose}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Code size={16} className="inline mr-2" />
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., React useEffect Hook, Python Data Processing"
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/30 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Code size={16} className="inline mr-2" />
                    Programming Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 outline-none transition-all"
                    style={{ colorScheme: 'dark' }}
                    required
                  >
                    {languages.map((lang) => (
                      <option 
                        key={lang} 
                        value={lang}
                        style={{
                          backgroundColor: '#1f1f1f',
                          color: '#ffffff'
                        }}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <FileText size={16} className="inline mr-2" />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description of what this code does..."
                    rows={3}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/30 outline-none transition-all resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Tag size={16} className="inline mr-2" />
                    Tags
                  </label>
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        placeholder="Tag name"
                        className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/30 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeTagField(index)}
                        className="p-2 text-white/50 hover:text-white/80 transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTagField}
                    className="text-primary/80 hover:text-primary text-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus size={14} />
                    Add Tag
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Collection
                    </label>
                    <select
                      value={collection}
                      onChange={(e) => setCollection(e.target.value)}
                      className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 outline-none transition-all"
                      style={{ colorScheme: 'dark' }}
                    >
                      {bookmarkCollections.length > 0 ? (
                        bookmarkCollections.map((collection) => (
                          <option 
                            key={collection.id} 
                            value={collection.name}
                            style={{
                              backgroundColor: '#1f1f1f',
                              color: '#ffffff'
                            }}
                          >
                            {collection.name}
                          </option>
                        ))
                      ) : (
                        <option 
                          value="Uncategorized"
                          style={{
                            backgroundColor: '#1f1f1f',
                            color: '#ffffff'
                          }}
                        >
                          Uncategorized
                        </option>
                      )}
                    </select>
                  </div>
                  
                  <div className="flex flex-col justify-end space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublicCode"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 text-primary focus:ring-primary/50 bg-white/5"
                      />
                      <label htmlFor="isPublicCode" className="ml-2 block text-white/80 text-sm">
                        <Globe size={14} className="inline mr-1" />
                        Public code block
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFavoriteCode"
                        checked={isFavorite}
                        onChange={(e) => setIsFavorite(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 text-primary focus:ring-primary/50 bg-white/5"
                      />
                      <label htmlFor="isFavoriteCode" className="ml-2 block text-white/80 text-sm">
                        <Heart size={14} className="inline mr-1" />
                        Add to favorites
                      </label>
                    </div>
                  </div>
                </div>

                {!showCodeField ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowCodeField(true)}
                      className="w-full p-4 rounded-lg bg-black/20 border border-white/10 hover:border-primary/50 text-white/70 hover:text-white/90 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Code size={20} className="text-primary group-hover:text-primary/80" />
                      <span className="font-medium">Click to add your code</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-white/80 text-sm font-medium">
                        <Code size={16} className="inline mr-2" />
                        Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCodeField(false)}
                        className="text-white/50 hover:text-white/80 transition-colors text-sm"
                      >
                        Collapse
                      </button>
                    </div>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Paste your code here..."
                      rows={12}
                      className="w-full p-3 rounded-lg bg-black/20 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/30 outline-none transition-all font-mono text-sm resize-none"
                      required
                      autoFocus
                    />
                  </div>
                )}
              </div>

              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <NeonButton type="submit" color="primary">
                  {editingCodeBlock ? 'Update' : 'Save'} Code Block
                </NeonButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddCodeBlockModal;
