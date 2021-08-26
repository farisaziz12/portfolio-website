const navbar = "flex items-center justify-between flex-wrap p-4 lg:p-8";

const navbarTitleContainer = "flex items-center flex-shrink-0 mr-6";

const navbarTitle = "font-semibold text-2xl tracking-tight tracking-wide";

const navbarItemsContainer =
  "transition-all duration-500 w-full block flex-grow lg:flex lg:items-center lg:w-auto lg:fixed right-5 z-10 h-16";

const navbarItems = "text-sm lg:flex-grow";

const navbarItem =
  "block mt-4 lg:inline-block lg:mt-0 mr-4 text-lg md:hover:underline cursor-pointer";

const navBackground =
  "lg:p-2 lg:rounded-md lg:bg-indigo-600 dark:bg-green-800 lg:font-bold lg:tracking-wide"; // don't add extra spaces cause of .split(" ")

const button =
  "transition ease-in inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-black hover:bg-white mt-4 lg:mt-0 mr-6";

const styles = {
  navbar,
  navbarTitleContainer,
  navbarTitle,
  navbarItemsContainer,
  navbarItems,
  navbarItem,
  button,
  navBackground,
};

module.exports = styles;
