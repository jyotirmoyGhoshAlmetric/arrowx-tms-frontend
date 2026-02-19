import React from "react";

const Footer: React.FC<{ className?: string }> = ({
  className = "custom-class",
}) => {
  const date = new Date();

  return (
    <footer className={className + " static"}>
      <div className="site-footer px-6 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 py-4">
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-5">
          <div className="text-center md:ltr:text-start md:rtl:text-right text-sm">
            COPYRIGHT &copy; {date.getFullYear()} ArrowX, All rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
