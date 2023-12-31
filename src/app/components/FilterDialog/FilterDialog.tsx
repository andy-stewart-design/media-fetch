import { useContext } from "react";
import Dialog from "@components/Dialog";
import QualityFilter from "./QualityFilter";
import SizeFilter from "./SizeFilter";
import OrientationFilter from "./OrientationFilter/";
import { FilterDialogDisplayContext } from "@components/Providers/FilterDialogDisplayProvider";
import { useNumberInput, useRadio } from "@hooks/use-input";
import classes from "./component.module.css";

export default function FilterDialog() {
  const { showDialog, setShowDialog } = useContext(FilterDialogDisplayContext);
  const [exportQuality, setExportQuality, restExportQualityProps] =
    useNumberInput(60, 1, 100, 1);
  const [exportSize, setExportSize, restExportSizeProps] = useNumberInput(
    2400,
    1200,
    3200,
    100
  );
  const [orientation, setOrientation] = useRadio("all");

  return (
    <Dialog
      className={classes["dialog"]}
      showDialog={showDialog}
      setShowDialog={setShowDialog}
    >
      <section className={classes["header"]}>
        <p className="flex-grow">Additional Filters</p>
        <button onClick={setShowDialog}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 3L17 17M17 3L10 10L3 17"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
        </button>
      </section>
      <section className="flex gap-xs">
        <QualityFilter
          value={exportQuality}
          onChange={setExportQuality}
          {...restExportQualityProps}
        />
        <SizeFilter
          value={exportSize}
          onChange={setExportSize}
          {...restExportSizeProps}
        />
      </section>
      <section>
        <OrientationFilter
          label="Orientation"
          value={orientation}
          onChange={setOrientation}
          options={[
            { label: "All", value: "all" },
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
            { label: "Square", value: "square" },
          ]}
        />
      </section>
    </Dialog>
  );
}
