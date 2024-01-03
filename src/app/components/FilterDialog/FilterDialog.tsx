import { useContext } from "react";
import Dialog from "@components/Dialog";
import FilterHeader from "./FilterHeader";
import QualityFilter from "./QualityFilter";
import SizeFilter from "./SizeFilter";
import OrientationFilter from "./OrientationFilter/";
import ColorFilter from "./ColorFilter";
import { FilterDialogDisplayContext } from "@components/Providers/FilterDialogDisplayProvider";
import { useNumberInput, useRadio } from "@hooks/use-input";
import { COLOR_OPTIONS, ORIENTATION_OPTIONS } from "@src/app/constants/filters";
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
  const [primaryColor, setPrimaryColor] = useRadio("any");

  return (
    <Dialog
      className={classes["dialog"]}
      showDialog={showDialog}
      setShowDialog={setShowDialog}
    >
      <section>
        <FilterHeader setShowDialog={setShowDialog} />
      </section>
      <section>
        <OrientationFilter
          label="Orientation"
          value={orientation}
          onChange={setOrientation}
          options={ORIENTATION_OPTIONS}
        />
      </section>
      <section>
        <ColorFilter
          label="Primary Color"
          value={primaryColor}
          onChange={setPrimaryColor}
          options={COLOR_OPTIONS}
        />
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
    </Dialog>
  );
}
