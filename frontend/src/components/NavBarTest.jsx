import Logo from "./Logo";
import Search from "./Search";

function NavBarTest() {
  return (
    <div className="p-[1.4rem]">
      <nav className="grid grid-cols-3 items-center h-[4.3rem] px-8 bg-[var(--color-primary)] rounded-[0.9rem]">
        <Logo />
        <Search />
      </nav>
    </div>
  );
}

export default NavBarTest;
