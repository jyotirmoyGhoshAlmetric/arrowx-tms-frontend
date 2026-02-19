import {
  Dialog,
  Transition,
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import { Fragment, useState, type ChangeEvent } from "react";
import Icon from "@/components/ui/Icon";

// Types for search items
interface SearchItem {
  id: number;
  name: string;
  url?: string;
  category?: string;
}

// Props interface for the SearchModal component
interface SearchModalProps {
  onItemSelect?: (item: SearchItem) => void;
  searchData?: SearchItem[];
  placeholder?: string;
  maxResults?: number;
}

const SearchModal: React.FC<SearchModalProps> = ({
  onItemSelect,
  searchData,
  placeholder = "Search...",
  maxResults = 10,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);

  // Default search data if none provided
  const defaultSearchList: SearchItem[] = [
    {
      id: 1,
      name: "What is Dashcode ?",
      category: "FAQ",
    },
    {
      id: 2,
      name: "Our Services",
      category: "About",
    },
    {
      id: 3,
      name: "Our Team",
      category: "About",
    },
    {
      id: 4,
      name: "Our Clients",
      category: "Portfolio",
    },
    {
      id: 5,
      name: "Our Partners",
      category: "Business",
    },
    {
      id: 6,
      name: "Our Blog",
      category: "Content",
    },
    {
      id: 7,
      name: "Our Contact",
      category: "Support",
    },
  ];

  const searchList = searchData || defaultSearchList;

  function closeModal(): void {
    setIsOpen(false);
    setQuery("");
    setSelectedItem(null);
  }

  function openModal(): void {
    setIsOpen(true);
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleItemSelect = (item: SearchItem | null): void => {
     if (!item) return;
    setSelectedItem(item);
    if (onItemSelect) {
      onItemSelect(item);
    }
    closeModal();
  };

  // Filter search results
  const filteredSearchList =
    query.trim() === ""
      ? searchList.slice(0, maxResults)
      : searchList
          .filter(
            (item) =>
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              (item.category &&
                item.category.toLowerCase().includes(query.toLowerCase())),
          )
          .slice(0, maxResults);

  return (
    <>
      <div>
        <button
          type="button"
          className="flex items-center xl:text-sm text-lg xl:text-slate-400 text-slate-800 dark:text-slate-300 px-1 space-x-3 rtl:space-x-reverse hover:text-slate-600 dark:hover:text-slate-100 transition-colors"
          onClick={openModal}
          aria-label="Open search modal"
        >
          <Icon icon="heroicons-outline:search" />
          <span className="xl:inline-block hidden">Search...</span>
        </button>
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[9999] overflow-y-auto p-4 md:pt-[25vh] pt-20"
          onClose={closeModal}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-filter backdrop-blur-xs backdrop-brightness-10" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative mx-auto max-w-xl">
              <Combobox value={selectedItem} onChange={handleItemSelect}>
                <div className="relative">
                  <div className="relative mx-auto max-w-xl rounded-md bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-gray-500/50 dark:ring-slate-600 divide-y divide-gray-500/30 dark:divide-slate-600">
                    <div className="flex bg-white dark:bg-slate-800 px-3 rounded-t-md py-3 items-center">
                      <div className="flex-0 text-slate-700 dark:text-slate-300 ltr:pr-2 rtl:pl-2 text-lg">
                        <Icon icon="heroicons-outline:search" />
                      </div>
                      <ComboboxInput
                        className="bg-transparent outline-none focus:outline-none border-none w-full flex-1 dark:placeholder:text-slate-300 dark:text-slate-200 text-slate-900 placeholder:text-slate-500"
                        placeholder={placeholder}
                        onChange={handleInputChange}
                        value={query}
                        autoComplete="off"
                        autoFocus
                      />
                      <button
                        type="button"
                        className="flex-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                        onClick={closeModal}
                        aria-label="Close search"
                      >
                        <Icon icon="heroicons-outline:x-mark" />
                      </button>
                    </div>

                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <ComboboxOptions className="max-h-60 overflow-y-auto text-sm py-2 focus:outline-none">
                        {filteredSearchList.length === 0 &&
                          query.trim() !== "" && (
                            <div className="px-4 py-6 text-center">
                              <Icon
                                icon="heroicons-outline:magnifying-glass"
                                className="mx-auto h-12 w-12 text-slate-400 mb-2"
                              />
                              <p className="text-slate-500 text-base dark:text-slate-400">
                                No results found for "{query}"
                              </p>
                              <p className="text-slate-400 text-sm dark:text-slate-500 mt-1">
                                Try adjusting your search terms
                              </p>
                            </div>
                          )}

                        {query.trim() === "" &&
                          filteredSearchList.length > 0 && (
                            <div className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                              Recent searches
                            </div>
                          )}

                        {filteredSearchList.map((item: SearchItem) => (
                          <ComboboxOption
                            key={item.id}
                            value={item}
                            className="cursor-pointer"
                          >
                            {({ focus }: { focus: boolean }) => (
                              <div
                                className={`px-4 text-[15px] font-normal py-3 flex items-center justify-between transition-colors ${
                                  focus
                                    ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                                    : "text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    <Icon
                                      icon="heroicons-outline:document-text"
                                      className="h-4 w-4 text-slate-400"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {item.name}
                                    </p>
                                    {item.category && (
                                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        in {item.category}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {focus && (
                                  <div className="flex-shrink-0">
                                    <Icon
                                      icon="heroicons-outline:arrow-right"
                                      className="h-4 w-4 text-slate-400"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </ComboboxOption>
                        ))}

                        {query.trim() !== "" &&
                          filteredSearchList.length > 0 && (
                            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-600">
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Showing {filteredSearchList.length} result
                                {filteredSearchList.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          )}
                      </ComboboxOptions>
                    </Transition>
                  </div>
                </div>
              </Combobox>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
};

export default SearchModal;
