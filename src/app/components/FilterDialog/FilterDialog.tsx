import { useContext } from "react";
import { FilterDialogDisplayContext } from "@components/Providers/FilterDialogDisplayProvider";
import Dialog from "@components/Dialog";
import classes from "./component.module.css";

export default function FilterDialog() {
  const { showDialog, setShowDialog } = useContext(FilterDialogDisplayContext);

  return (
    <Dialog
      className={classes["dialog"]}
      showDialog={showDialog}
      setShowDialog={setShowDialog}
    >
      <section className={classes["header"]}>
        <p className="flex-grow">Additional Filters</p>
        <button onClick={setShowDialog}>Close</button>
      </section>
    </Dialog>
  );
}
