function Search() {
  return (
    <input
      className="justify-self-center border-none px-6 py-[0.6rem] text-[1rem] rounded-[0.7rem] w-[40rem] transition-all text-white bg-[var(--color-primary-light)] placeholder-[var(--color-text-dark)] focus:outline-none focus:shadow-[0_2.4rem_2.4rem_rgba(0,0,0,0.1)] focus:-translate-y-[2px]"
      type="text"
      placeholder="Search restaurants..."
    />
  );
}

export default Search;
