import LoadingSpinner from "../LoadingSpinner";

const TitleEditBox = ({
  title,
  value,
  handleValueChange,
  handleValueSubmit,
  inputRef,
  setIsEditingTitle,
  savingState,
}) => {
  return (
    <div className="absolute top-0 left-0 bg-white p-4 shadow-md border-[1px] border-gray-300 rounded-md z-50 flex flex-col gap-4">
      <div className="flex flex-col items-start gap-[4px]">
        <span className="text-sm text-gray-400">{title}</span>
        <input
          type="text"
          className="w-60 px-3 py-2 text-gray-700 rounded-md border focus:outline-none "
          value={value}
          onChange={handleValueChange}
          ref={inputRef}
        />
      </div>
      <div className="flex flex-row gap-[12px] w-full justify-end">
        <button
          onClick={() => {
            setIsEditingTitle(false);
          }}
        >
          Cancel
        </button>
        <button
          className="primary"
          onClick={() => {
            console.log("submitting");
            handleValueSubmit();
          }}
        >
          {savingState ? <LoadingSpinner className="w-5 h-5" /> : `Save`}
        </button>
      </div>
    </div>
  );
};

export default TitleEditBox;
