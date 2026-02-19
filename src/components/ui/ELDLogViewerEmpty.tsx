import Card from "./Card";
import Icon from "@/components/ui/Icon";

const ELDLogViewerEmpty = () => {
  return (
    <Card className="no-border shadow-base">
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <Icon
              icon="heroicons-outline:document-text"
              className="w-16 h-16 mx-auto text-slate-500 dark:text-slate-400"
            />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No Data to Display
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Please select a start date, end date, and driver to view driver
            logs.
          </p>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p>• Choose a start date and end date</p>
            <p>• Select a specific driver</p>
            <p>• Click "Apply" to load the logs</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ELDLogViewerEmpty;
