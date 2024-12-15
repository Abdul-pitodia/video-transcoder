import { useState } from 'react';

type kv = {
    name: string;
    value: string
}

interface props {
    items: kv[];
    extraStyles: string;
    name: string;
    onDropDownSelect: (selectedDropDownValue: string) => void;
}

const Dropdown = ({ items, extraStyles, name, onDropDownSelect } : props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [val, setVal] = useState("")

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const styles = `relative inline-block text-left ${extraStyles}`

  return (
    <div className='flex gap-4 items-center mb-4 w-full mr-2'>
        <div className={styles}>
            {/* Dropdown Button */}
            <button
                onClick={toggleDropdown}
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {name}
                <svg
                className="w-5 h-5 ml-2 -mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                >
                <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                >
                <div className="py-1" role="none">
                    {items.map(item => (
                        <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        key={item.name}
                        role="menuitem"
                        onClick={() => {
                            setVal(item.name)
                            onDropDownSelect(item.value)
                            toggleDropdown()
                            return;
                        }}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
                </div>
            )}
        </div>

        <span className='text-slate-800 text-md font-semibold'>{val}</span>
    </div>
  );
};

export default Dropdown;
