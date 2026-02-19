// import React, { useRef, useEffect, useState } from "react";
// import Flatpickr from "react-flatpickr";
// import { format } from "date-fns";
// import type { BaseOptions } from "flatpickr/dist/types/options";
// import flatpickr from "flatpickr";
// import "flatpickr/dist/themes/light.css"; // Import Flatpickr CSS

// export interface DateRange {
//   startDate: Date | null;
//   endDate: Date | null;
// }

// interface CustomDateRangePickerProps {
//   value?: DateRange;
//   onChange: (dateRange: DateRange) => void;
//   placeholder?: string;
//   className?: string;
//   disabled?: boolean;
//   minDate?: Date | string;
//   maxDate?: Date | string;
//   dateFormat?: string;
//   displayFormat?: string;
//   showClearButton?: boolean;
//   showCalendarIcon?: boolean;
//   size?: "sm" | "md" | "lg";
//   variant?: "outline" | "filled";
//   error?: boolean;
//   helperText?: string;
// }

// const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
//   value,
//   onChange,
//   placeholder = "Select date range",
//   className = "",
//   disabled = false,
//   minDate,
//   maxDate,
//   dateFormat = "Y-m-d",
//   displayFormat = "MMM dd, yyyy",
//   showClearButton = true,
//   showCalendarIcon = true,
//   size = "md",
//   variant = "outline",
//   error = false,
//   helperText,
// }) => {
//   const flatpickrRef = useRef<flatpickr.Instance | null>(null);
//   const [displayValue, setDisplayValue] = useState<string>("");

//   // Update display value when value prop changes
//   useEffect(() => {
//     if (value?.startDate && value?.endDate) {
//       const startStr = format(value.startDate, displayFormat);
//       const endStr = format(value.endDate, displayFormat);
//       setDisplayValue(`${startStr} - ${endStr}`);
//     } else if (value?.startDate) {
//       const startStr = format(value.startDate, displayFormat);
//       setDisplayValue(`${startStr} - ...`);
//     } else {
//       setDisplayValue("");
//     }
//   }, [value, displayFormat]);

//   // Handle date change
//   const handleDateChange = (dates: Date[]) => {
//     const dateRange: DateRange = {
//       startDate: dates[0] || null,
//       endDate: dates[1] || null,
//     };

//     onChange(dateRange);
//   };

//   // Handle clear button click
//   const handleClear = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (flatpickrRef.current) {
//       flatpickrRef.current.clear();
//     }
//     onChange({ startDate: null, endDate: null });
//   };

//   // Handle calendar icon click
//   const handleCalendarClick = () => {
//     if (!disabled && flatpickrRef.current) {
//       flatpickrRef.current.open();
//     }
//   };

//   // Get initial dates for Flatpickr
//   const getInitialDates = (): Date[] => {
//     const dates: Date[] = [];
//     if (value?.startDate) dates.push(value.startDate);
//     if (value?.endDate) dates.push(value.endDate);
//     return dates;
//   };

//   // Flatpickr options
//   const flatpickrOptions: Partial<BaseOptions> = {
//     mode: "range",
//     dateFormat: dateFormat,
//     defaultDate: getInitialDates(),
//     minDate: minDate,
//     maxDate: maxDate,
//     clickOpens: !disabled,
//     allowInput: false,
//     showMonths: 2,
//     monthSelectorType: "dropdown",
//     // yearSelectorType: "dropdown",
//     prevArrow:
//       '<svg class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>',
//     nextArrow:
//       '<svg class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>',
//     onReady: (selectedDates, dateStr, instance) => {
//       flatpickrRef.current = instance;
//     },
//     onClose: (selectedDates) => {
//       // Ensure we have proper date range when calendar closes
//       if (selectedDates.length === 1) {
//         // If only one date selected, clear it to avoid confusion
//         setTimeout(() => {
//           if (flatpickrRef.current) {
//             flatpickrRef.current.clear();
//           }
//           onChange({ startDate: null, endDate: null });
//         }, 100);
//       }
//     },
//   };

//   // Size classes
//   const sizeClasses = {
//     sm: "px-3 py-1.5 text-sm",
//     md: "px-3 py-2 text-sm",
//     lg: "px-4 py-2.5 text-base",
//   };

//   // Variant classes
//   const variantClasses = {
//     outline: `border ${error ? "border-red-500" : "border-gray-300"} bg-white`,
//     filled: `border border-transparent ${error ? "bg-red-50" : "bg-gray-50"}`,
//   };

//   // Build input classes
//   const inputClasses = [
//     "w-full rounded-lg transition-colors duration-200",
//     "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
//     "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
//     sizeClasses[size],
//     variantClasses[variant],
//     showCalendarIcon ? "pr-10" : "",
//     showClearButton && displayValue ? "pr-16" : "",
//     className,
//   ]
//     .filter(Boolean)
//     .join(" ");

//   return (
//     <div className="relative">
//       <div className="relative">
//         <Flatpickr
//           className={inputClasses}
//           options={flatpickrOptions}
//           value={displayValue}
//           onChange={handleDateChange}
//           placeholder={placeholder}
//           disabled={disabled}
//           readOnly
//         />

//         {/* Icons container */}
//         <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//           {/* Clear button */}
//           {showClearButton && displayValue && !disabled && (
//             <button
//               type="button"
//               onClick={handleClear}
//               className="p-1 text-gray-400 hover:text-gray-600 transition-colors mr-1"
//               tabIndex={-1}
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           )}

//           {/* Calendar icon */}
//           {showCalendarIcon && (
//             <button
//               type="button"
//               onClick={handleCalendarClick}
//               className={`p-1 transition-colors ${
//                 disabled
//                   ? "text-gray-300 cursor-not-allowed"
//                   : "text-gray-400 hover:text-gray-600 cursor-pointer"
//               }`}
//               disabled={disabled}
//               tabIndex={-1}
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Helper text */}
//       {helperText && (
//         <p
//           className={`mt-1 text-xs ${error ? "text-red-600" : "text-gray-500"}`}
//         >
//           {helperText}
//         </p>
//       )}
//     </div>
//   );
// };

// export default CustomDateRangePicker;
